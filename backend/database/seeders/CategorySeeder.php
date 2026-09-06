<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'title' => 'Artigo Científico',
            'description' => 'Trabalhos completos com resultados de pesquisa original.',
            'deadline' => now()->addMonths(2),
            'vacancies' => 50,
            'active' => true,
        ]);

        Category::create([
            'title' => 'Resumo Expandido',
            'description' => 'Síntese de pesquisas em andamento, até 4 páginas.',
            'deadline' => now()->addMonths(1),
            'vacancies' => 100,
            'active' => true,
        ]);

        Category::create([
            'title' => 'Pôster Acadêmico',
            'description' => 'Apresentação visual de projetos de pesquisa.',
            'deadline' => now()->addWeeks(6),
            'vacancies' => 30,
            'active' => true,
        ]);

        Category::create([
            'title' => 'Tese/Dissertação',
            'description' => 'Submissão fechada — aguardando próxima edição.',
            'deadline' => null,
            'vacancies' => null,
            'active' => false,
        ]);
    }
}
