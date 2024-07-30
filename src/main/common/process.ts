
// import {execa} from "execa";
// const {execa} = require('execa');

import {ChildProcessWithoutNullStreams, spawn} from "node:child_process";
import {Logger} from "./logger";
import {Dispose} from "../../common/container/dispose";

export class Process extends Dispose{
    value = 'clean process'

    constructor(protected cmd: string[]) {
        super();
        // Logger.info(`>> will exec ${this.cmd}`);
        // Logger.info(this.cmd);

        this.stderr = []
        this.stdout = []
    }

    protected _process?: ChildProcessWithoutNullStreams

    dispose() {
        Logger.info(`>> Process ${this._process.pid} dispose`);
        this._process?.kill(9)
    }

    stdout: string[]
    stderr: string[]
    retCode: number
    async run(sync: boolean = true): Promise<Process>{

        try {

            let waitResolve: any
            const _wait = new Promise(resolve => waitResolve = resolve)

            // spawn
            const [_exec, ...args] = this.cmd
            Logger.info("====run cmd====")
            Logger.info(_exec)
            Logger.info(args)
            Logger.info("====run cmd====")
            this._process = spawn(_exec, args)
            const pro = this._process

            pro.on('exit', (code) => {
                Logger.info(`>> exit code: ${code}`)
                this.retCode = code
                waitResolve(code)
            })
            pro.stdout.on('data', (data: Buffer) => {
                Logger.info('>> stdout: ')
                Logger.info(data.toString())
                this.stdout.push(data.toString())
            })
            pro.stderr.on('data', (data: Buffer) => {
                Logger.warn('>> stderr: ')
                Logger.warn(data.toString())
                this.stderr.push(data.toString())
            })

            if (!sync) waitResolve()

            Logger.info(`>> wait cmd end`)

            await _wait

            Logger.info(`>> cmd run end`)
        } catch (e) {
            Logger.error(`>> cm run error: ${e}`)
        }

        // execa

        // const [_exec, ...args] = this.cmd
        // const {stdout, code, stderr} = await execa(_exec, args)
        // this.stdout = stdout
        // this.stderr = stderr
        // this.retCode = code
        return this
    }
}

