<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

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
            'author_email' => ['required', 'email', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'resume' => ['nullable', 'string', 'max:2000'],
            'desired_date' => ['required', 'date', 'after_or_equal:today'],
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
            'desired_date.after_or_equal' => 'A data precisa ser hoje ou uma data futura.',
        ];
    }
}
