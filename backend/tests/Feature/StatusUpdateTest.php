<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StatusUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function criarSubmissaoPendente(): Submission
    {
        $category = Category::factory()->create();

        return Submission::create([
            'author_name' => 'Autor Teste',
            'author_email' => 'autor@example.com',
            'category_id' => $category->id,
            'title' => 'Trabalho de teste',
            'desired_date' => now()->addWeek(),
        ]);
    }

    public function test_admin_pode_confirmar_uma_submissao(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['*']);
        $submission = $this->criarSubmissaoPendente();

        $response = $this->patchJson("/api/admin/submissions/{$submission->id}/status", [
            'status' => 'approved',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'approved']);

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'approved',
        ]);
    }

    public function test_admin_pode_cancelar_uma_submissao(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['*']);
        $submission = $this->criarSubmissaoPendente();

        $response = $this->patchJson("/api/admin/submissions/{$submission->id}/status", [
            'status' => 'canceled',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'canceled']);
    }

    public function test_status_invalido_e_rejeitado(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['*']);
        $submission = $this->criarSubmissaoPendente();

        $response = $this->patchJson("/api/admin/submissions/{$submission->id}/status", [
            'status' => 'aprovado', // não existe no enum
        ]);

        $response->assertStatus(422);

        $this->assertDatabaseHas('submissions', [
            'id' => $submission->id,
            'status' => 'pending', // não mudou
        ]);
    }
}
