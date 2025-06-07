<?php
use App\Models\User;
use App\Models\TaskList;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});


test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    TaskList::factory()->create(['user_id' => $user->id]);

    $this->get('/dashboard')->assertOk();
});