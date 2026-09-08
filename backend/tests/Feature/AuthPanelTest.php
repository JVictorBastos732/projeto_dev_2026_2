<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_painel_bloqueia_acesso_sem_autenticacao(): void
    {
        $response = $this->getJson('/api/admin/submissions');
        $response->assertStatus(401);
    }

    public function test_gestao_de_categorias_tambem_e_bloqueada_sem_autenticacao(): void
    {
        $response = $this->postJson('/api/admin/categories', ['title' => 'Teste']);
        $response->assertStatus(401);
    }

    public function test_login_com_credenciais_invalidas_e_recusado(): void
    {
        User::factory()->create([
            'email' => 'admin@portal.com',
            'password' => bcrypt('senha-correta'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@portal.com',
            'password' => 'senha-errada',
        ]);

        $response->assertStatus(422);
    }

    public function test_admin_autenticado_acessa_o_painel(): void
    {
        Sanctum::actingAs(User::factory()->create(), ['*']);
        $response = $this->getJson('/api/admin/submissions');
        $response->assertStatus(200);
    }
}
