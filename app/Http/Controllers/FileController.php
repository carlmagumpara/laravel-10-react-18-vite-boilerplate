<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Helpers\Utils;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $fileName = Utils::generateRandomString(10);

        Storage::disk('local')->putFileAs(
            'public/files/',
            $request->file('file'),
            $fileName.'.'.$request->file('file')->getClientOriginalExtension(),
        );
        
        return response()->json([
            'data' => asset('/storage/files/'.$fileName.'.'.$request->file('file')->getClientOriginalExtension()),
            'message' => 'File Uploaded Successfully!',
            'success' => true,
        ], 200); 
    }
}
