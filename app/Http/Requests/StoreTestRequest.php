<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //'number' => 'required|string|max:255|unique:test_requests,number',
            //'user_id' => 'required|exists:users,id',
            'style_id' => 'required|exists:styles,id',
            'item' => 'required|string|max:255',
            'notes' => 'string|max:255',
            'wash_type' => 'nullable|string|max:50',
            'test_type_ids' => 'required|array|min:1',
            'test_type_ids.*' => 'exists:test_types,id',
            'new_image' => 'sometimes|file|image|max:5120'
        ];
    }
}
