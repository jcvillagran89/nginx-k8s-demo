<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $role = $this->input('role');
        if (is_array($role)) {
            $name = $role['name'] ?? null;
            $id   = $role['id']   ?? null;
            $merge = [];
            if ($name) $merge['role'] = $name;
            if ($id && !$name) $merge['role_id'] = $id;
            $this->merge($merge);
        }
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id ?? null;
        return [
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'role'  => ['required_without:role_id', 'string', 'exists:roles,name'],
            'role_id' => ['required_without:role', 'integer', 'exists:roles,id'],
            'password' => ['nullable', 'string', 'min:8'],
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name'),
            ],
        ];
    }
}
