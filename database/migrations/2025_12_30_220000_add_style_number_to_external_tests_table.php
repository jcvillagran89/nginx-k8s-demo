<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (! Schema::hasColumn('external_tests', 'style_number')) {
                $table->string('style_number')->nullable()->after('style_id');
                $table->index('style_number');
            }
        });

        if (Schema::hasColumn('external_tests', 'style_number')) {
            DB::table('external_tests')
                ->whereNull('style_number')
                ->orWhere('style_number', '')
                ->orderBy('id')
                ->chunkById(500, function ($tests) {
                    foreach ($tests as $test) {
                        $styleNumber = DB::table('styles')
                            ->where('id', $test->style_id)
                            ->value('number');

                        if ($styleNumber) {
                            DB::table('external_tests')
                                ->where('id', $test->id)
                                ->update(['style_number' => $styleNumber]);
                        }
                    }
                });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('external_tests', function (Blueprint $table) {
            if (Schema::hasColumn('external_tests', 'style_number')) {
                $table->dropIndex(['style_number']);
                $table->dropColumn('style_number');
            }
        });
    }
};
