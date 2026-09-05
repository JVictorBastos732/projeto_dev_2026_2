<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{

    protected string $token;

    /**
     * Cria uma nova instância do recurso de login.
     *
     * @param  mixed   $user   Instância do usuário autenticado.
     * @param  string  $token  Token de autenticação gerado.
     */
    
    public function __construct($user, string $token) {
        parent::__construct($user);
        $this->token = $token;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'reason' => 'login_succesfull',
            'message' => 'Login realizado com sucesso',
            'status' => 200,
            'access_token' => $this->token,
            'token_type' => 'Bearer',
            'user' => new UserResource($this->resource),
        ];
    }
}
