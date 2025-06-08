<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $query = User::where('user_role', '!=', 'admin');

     

        // Prepare roles for the frontend
    $roles = collect(User::ROLES)
        ->map(function ($name, $id) {
            return [
                'id' => $id,
                'name' => $name,
            ];
        })
        ->values();


       // Handle search
    if (request()->has('search') && !empty(request('search'))) {
        $search = request('search');
        $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
      
         // Handle role filter
    if (request()->has('filter') && request('filter') !== 'all') {
        $query->where('user_role', request('filter'));
    }

       $users = $query->paginate(3);
//        Log::info('Users Index Data', [
//     'users' => $users->toArray(),
//     'userRoles' => $roles,
//     'filters' => [
//         'search' => request('search', ''),
//         'filter' => request('filter', 'Select Role'),
//     ],
// ]);
   
        return Inertia::render('admin/users/index', [
            'users' => $users,
            'userRoles' => $roles,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', 'Select Role'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
{
    // Map the roles to an array with id and name
   
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validRoles = array_values(User::ROLES);
    
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        'user_role' => ['required', Rule::in($validRoles)],
    ]);

    // Generate a random 12-character temporary password
    $temporaryPassword = Str::random(12);
    
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($temporaryPassword),
        'user_role' => $request->user_role,
    ]);

    // Return both success message and temporary password
    return redirect()->route('users.index')
        ->with('success', 'User created successfully!')
        ->with('temporary_password', $temporaryPassword);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
{
    Log::info('Deleting user:', ['id' => $user->id]);
    
    if (!$user->exists) {
        Log::error('User not found');
        abort(404);
    }
    
    $deleted = $user->delete();
    
    Log::info('Delete result:', ['success' => $deleted]);
    
    return redirect()->route('users.index')->with('success', 'User deleted successfully!');
}
}
