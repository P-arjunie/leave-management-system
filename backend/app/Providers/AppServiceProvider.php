<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // If you are using Laravel 10 or above, Passport::routes() is removed.
        // Define your API routes in routes/api.php and protect them with 'auth:api' middleware.
        // Example:
        // Route::middleware('auth:api')->get('/user', function (Request $request) {
        //     return $request->user();
        // });
       
    }
}
