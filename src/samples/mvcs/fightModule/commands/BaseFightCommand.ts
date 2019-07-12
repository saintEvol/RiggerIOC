
///<reference path='../SERVERS/FightServer.ts'/>
abstract class BaseFightCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(FightServer)
    private fightServer: FightServer;
}