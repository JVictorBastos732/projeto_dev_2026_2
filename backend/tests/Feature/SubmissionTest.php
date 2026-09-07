<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitante_pode_criar_submissao_valida(): void
    {
        $category = Category::factory()->create();

        $response = $this->postJson('/api/submissions', [
            'author_name' => 'Maria Silva',
            'author_email' => 'maria@example.com',
            'category_id' => $category->id,
            'title' => 'Um estudo sobre testes automatizados',
            'resume' => 'Resumo do trabalho.',
            'desired_date' => now()->addWeek()->toDateString(),
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['protocol', 'message']);

        $this->assertDatabaseHas('submissions', [
            'author_email' => 'maria@example.com',
            'status' => 'pending',
        ]);
    }

    public function test_submissao_com_dados_invalidos_nao_e_salva(): void
    {
        $response = $this->postJson('/api/submissions', [
            'author_name' => '',
            'author_email' => 'nao-e-um-email',
            'category_id' => 999,
            'title' => '',
            'desired_date' => 'ontem',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'author_name', 'author_email', 'category_id', 'title', 'desired_date',
            ]);

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_submissao_e_recusada_para_categoria_inativa(): void
    {
        $category = Category::factory()->inativa()->create();

        $response = $this->postJson('/api/submissions', [
            'author_name' => 'João Souza',
            'author_email' => 'joao@example.com',
            'category_id' => $category->id,
            'title' => 'Trabalho qualquer',
            'desired_date' => now()->addWeek()->toDateString(),
        ]);

        // Passa na validação de "exists", mas é barrada pela regra de negócio no controller.
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);

        $this->assertDatabaseCount('submissions', 0);
    }
}
