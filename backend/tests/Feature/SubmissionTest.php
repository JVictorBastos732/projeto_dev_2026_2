<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class SubmissionTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'author_name' => 'Maria Silva',
            'author_email' => 'maria@example.com',
            'title' => 'Um estudo sobre testes automatizados',
            'resume' => 'Resumo do trabalho.',
        ], $overrides);
    }

    public function test_visitante_pode_criar_submissao_valida(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(201)
            ->assertJsonStructure(['protocol', 'message']);

        $this->assertDatabaseHas('submissions', [
            'author_email' => 'maria@example.com',
            'status' => 'pending',
        ]);

        $submission = Submission::first();
        Storage::disk('public')->assertExists($submission->file_path);
    }

    public function test_submissao_com_dados_invalidos_nao_e_salva(): void
    {
        $response = $this->postJson('/api/submissions', [
            'author_name' => '',
            'author_email' => 'nao-e-um-email',
            'category_id' => 999,
            'title' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'author_name', 'author_email', 'category_id', 'title', 'file',
            ]);

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_pdf_e_obrigatorio(): void
    {
        $category = Category::factory()->create();

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            ['category_id' => $category->id]
            // sem 'file'
        ));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_arquivo_que_nao_e_pdf_e_recusado(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho.docx', 500, 'application/msword'),
            ]
        ));

        $response->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    public function test_submissao_e_recusada_para_categoria_inativa(): void
    {
        Storage::fake('public');
        $category = Category::factory()->inativa()->create();

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(422)->assertJsonValidationErrors(['category_id']);
        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_submissao_e_recusada_para_categoria_com_prazo_expirado(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create(['deadline' => now()->subDay()]);

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(422)->assertJsonValidationErrors(['category_id']);
        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_submissao_e_recusada_quando_categoria_sem_vagas(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create(['vacancies' => 1]);

        // Ocupa a única vaga
        Submission::create([
            'author_name' => 'Outro Autor',
            'author_email' => 'outro@example.com',
            'category_id' => $category->id,
            'title' => 'Outro trabalho',
            'file_path' => 'fake/path.pdf',
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(422)->assertJsonValidationErrors(['category_id']);
        $this->assertDatabaseCount('submissions', 1); // só a que já existia
    }

    public function test_vaga_e_liberada_quando_submissao_e_cancelada(): void
    {
        $category = Category::factory()->create(['vacancies' => 1]);

        $submission = Submission::create([
            'author_name' => 'Autor', 'author_email' => 'autor@example.com',
            'category_id' => $category->id, 'title' => 'Trabalho',
            'file_path' => 'fake/path.pdf', 'status' => 'pending',
        ]);

        $this->assertTrue($category->fresh()->is_full);

        $submission->update(['status' => 'canceled']);

        $this->assertFalse($category->fresh()->is_full);
    }

    public function test_submissao_duplicada_e_recusada(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        Submission::create([
            'author_name' => 'Maria Silva',
            'author_email' => 'maria@example.com',
            'category_id' => $category->id,
            'title' => 'Um estudo sobre testes automatizados',
            'file_path' => 'fake/path.pdf',
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(), // mesmo nome, email e título
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho2.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(422)->assertJsonValidationErrors(['author_email']);
        $this->assertDatabaseCount('submissions', 1);
    }

    public function test_mesmo_autor_pode_submeter_titulo_diferente(): void
    {
        Storage::fake('public');
        $category = Category::factory()->create();

        Submission::create([
            'author_name' => 'Maria Silva',
            'author_email' => 'maria@example.com',
            'category_id' => $category->id,
            'title' => 'Primeiro trabalho',
            'file_path' => 'fake/path.pdf',
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/submissions', array_merge(
            $this->payload(['title' => 'Segundo trabalho, diferente do primeiro']),
            [
                'category_id' => $category->id,
                'file' => UploadedFile::fake()->create('trabalho2.pdf', 500, 'application/pdf'),
            ]
        ));

        $response->assertStatus(201);
        $this->assertDatabaseCount('submissions', 2);
    }
}
