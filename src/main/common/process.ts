
// import {execa} from "execa";
// const {execa} = require('execa');

import {spawn} from "node:child_process";
import {Logger} from "./logger";

export class Process {

    constructor(protected cmd: string[]) {
        // Logger.info(`>> will exec ${this.cmd}`);
        // Logger.info(this.cmd);

        this.stderr = []
        this.stdout = []
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
            const pro = spawn(_exec, args)

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
                Logger.error('>> stderr: ')
                Logger.error(data.toString())
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

