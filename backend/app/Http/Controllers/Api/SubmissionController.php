<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Category;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SubmissionController extends Controller
{
    public function store(StoreSubmissionRequest $request)
    {
        $category = Category::findOrFail($request->category_id);

        if (! $category->active) {
        throw ValidationException::withMessages([
            'category_id' => 'Essa categoria não está mais aceitando submissões.',
        ]);
            }

            if ($category->is_expired) {
                throw ValidationException::withMessages([
                    'category_id' => 'O prazo de submissão dessa categoria já encerrou.',
                ]);
            }

            if ($category->is_full) {
                throw ValidationException::withMessages([
                    'category_id' => 'Essa categoria não tem mais vagas disponíveis.',
                ]);
            }

        $data = $request->validated();

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('submissions', 'public');
        }

        $submission = Submission::create($data);

        return response()->json([
            'protocol' => $submission->protocol,
            'message' => 'Submissão enviada com sucesso. Guarde seu protocolo para acompanhar o status.',
        ], 201);
    }

    // Público: consulta de status por protocolo, sem precisar de login
    public function consult(string $protocol)
    {
        $submission = Submission::where('protocol', $protocol)
            ->with('category:id,title')
            ->first();

        if (! $submission) {
            return response()->json(['message' => 'Protocolo não encontrado.'], 404);
        }

        return response()->json([
            'protocol' => $submission->protocol,
            'title' => $submission->title,
            'category' => $submission->category->title,
            'status' => $submission->status,
            'created_at' => $submission->created_at,
        ]);
    }

    // Admin: listagem com filtro, busca e paginação
    public function index(Request $request)
    {
        $query = Submission::with('category:id,title')
            ->orderByDesc('desire_date');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('author_name', 'like', "%{$search}%")
                  ->orWhere('author_email', 'like', "%{$search}%");
            });
        }

        return $query->paginate(15);
    }

    // Admin: aprovar ou cancelar
    public function updateStatus(Request $request, Submission $submission)
    {
        $request->validate([
            'status' => ['required', 'in:approved,canceled'],
        ]);

        $submission->update(['status' => $request->status]);

        return response()->json($submission->fresh('category'));
    }
}
