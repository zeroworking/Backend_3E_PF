import { Command } from 'commander';

const program = new Command();

program
    .option('-d','variable para debug',false)
    .option('-p <port>','puerto del server', 9090)
    .option('--mode <mode>','Modo de trabajo del server', 'development')
    .option('--email <email>','email admin')
    .option('--password <password>','password admin')

program.parse();

//console.log('Option',program.opts());
/* 
console.log('Option - Mode:',program.opts().mode);
console.log('Option - Port:',program.opts().p);
console.log('Option - Email:',program.opts().email);
console.log('Option - Password:',program.opts().password);

 */

// 2do - Listeners
process.on('exit', code => {
    console.log("Este codigo se ejecuta antes de salir del proceso.");
    console.log("Codigo de salida del process. ", code);
})


process.on('uncaughtException', exception => {
    console.log("Esta exception no fue capturada, o controlada.");
    console.log("Exception no capturada: ", exception);
})


process.on('message', message => {
    console.log("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
    console.log(`Mensaje recibido: ${message}`);
})






export default program;
