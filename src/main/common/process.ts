
// import {execa} from "execa";
// const {execa} = require('execa');

import {spawn} from "node:child_process";

export class Process {

    constructor(protected cmd: string[]) {
        // console.info(`>> will exec ${this.cmd}`);
        // console.info(this.cmd);

        this.stderr = []
        this.stdout = []
    }

    stdout: string[]
    stderr: string[]
    retCode: number
    async run(sync: boolean = true): Promise<Process>{

        let waitResolve: any
        const _wait = new Promise(resolve => waitResolve = resolve)

        // spawn
        const [_exec, ...args] = this.cmd
        console.log("====run cmd====")
        console.log(_exec)
        console.log(args)
        console.log("====run cmd====")
        const pro = spawn(_exec, args)

        pro.on('exit', (code) => {
            console.log(`>> exit code: ${code}`)
            this.retCode = code
            waitResolve(code)
        })
        pro.stdout.on('data', (data: Buffer) => {
            // console.log('>> stdout: ')
            // console.log(data.toString())
            this.stdout.push(data.toString())
        })
        pro.stderr.on('data', (data: Buffer) => {
            // console.error('>> stderr: ')
            // console.error(data.toString())
            this.stderr.push(data.toString())
        })

        if (!sync) waitResolve()

        await _wait

        // execa

        // const [_exec, ...args] = this.cmd
        // const {stdout, code, stderr} = await execa(_exec, args)
        // this.stdout = stdout
        // this.stderr = stderr
        // this.retCode = code
        return this
    }
}

