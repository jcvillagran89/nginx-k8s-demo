<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class OracleResetTestData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'oracle:reset-tests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Trunca tablas de pruebas y reinicia secuencias (Oracle)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $db = DB::connection('oracle');

        $truncateBlock = <<<SQL
            BEGIN
            BEGIN EXECUTE IMMEDIATE 'TRUNCATE TABLE TEST_RESULTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
            BEGIN EXECUTE IMMEDIATE 'TRUNCATE TABLE TESTS';        EXCEPTION WHEN OTHERS THEN NULL; END;
            BEGIN EXECUTE IMMEDIATE 'TRUNCATE TABLE TEST_REQUESTS';EXCEPTION WHEN OTHERS THEN NULL; END;
            END;
            SQL;

        $seqBlock = <<<SQL
        BEGIN
        -- TEST_RESULTS_ID_SEQ
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE TEST_RESULTS_ID_SEQ';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        EXECUTE IMMEDIATE 'CREATE SEQUENCE TEST_RESULTS_ID_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';

        -- TESTS_ID_SEQ
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE TESTS_ID_SEQ';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        EXECUTE IMMEDIATE 'CREATE SEQUENCE TESTS_ID_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';

        -- TEST_REQUESTS_ID_SEQ
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE TEST_REQUESTS_ID_SEQ';
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
        EXECUTE IMMEDIATE 'CREATE SEQUENCE TEST_REQUESTS_ID_SEQ START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
        END;
        SQL;

        try {
            $db->beginTransaction();

            $db->unprepared($truncateBlock);
            $db->unprepared($seqBlock);

            $db->commit();

            $this->info('OK. Tablas truncadas y secuencias reseteadas correctamente.');
            $this->line('- TEST_RESULTS, TESTS, TEST_REQUESTS');
            $this->line('- TEST_RESULTS_ID_SEQ, TESTS_ID_SEQ, TEST_REQUESTS_ID_SEQ');

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $db->rollBack();

            $this->error('ERROR. Error al resetear datos/secuencias.');
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }
}
