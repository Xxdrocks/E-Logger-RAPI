<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LogRequest extends FormRequest
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
            "frequency" => "required|max:20",
            "ncs_1028" => "required|max:7",
            "waktu" => "required|max:20",
            "zzd" => "nullable|string|max:10",
            "nama" => "nullable|string|max:100",
            "keterangan" => "nullable|string"
        ];
    }
}
