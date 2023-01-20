<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function Landing(Request $request) {
        return Inertia::render('Landing', []);
    }

    public function Board(Request $request) {
        return Inertia::render('Board', []);
    }
}
