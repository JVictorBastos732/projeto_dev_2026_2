<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'author_name' => ['required', 'string', 'max:255'],
        'author_email' => [
            'required', 'email', 'max:255',
            Rule::unique('submissions')->where(function ($query) {
                return $query->where('author_name', $this->author_name)
                    ->where('title', $this->title)
                    ->where('category_id', $this->category_id);
            }),
        ],
        'category_id' => ['required', 'exists:categories,id'],
        'title' => ['required', 'string', 'max:255'],
        'resume' => ['nullable', 'string', 'max:2000'],
        'file' => ['required', 'file', 'mimes:pdf', 'max:10240'], //10MB
        ];
    }

    public function messages(): array
    {
        return [
            'author_name.required' => 'Informe seu nome.',
            'author_email.required' => 'Informe um email.',
            'author_email.email' => 'Email inválido.',
            'category_id.required' => 'Escolha uma categoria.',
            'category_id.exists' => 'Categoria inválida.',
            'title.required' => 'Informe o título do trabalho.',
            'file.required' => 'Anexe o PDF do trabalho.',
            'file.mimes' => 'O arquivo precisa estar em formato PDF.',
            'file.max' => 'O arquivo não pode passar de 10MB.',
            'author_email.unique' => 'Você já enviou uma submissão com esse nome, email e título para essa categoria.',
        ];
    }
}
