
///<reference path='../SERVERS/FightServer.ts'/>
@riggerIOC.autoDispose
abstract class BaseFightCommand extends riggerIOC.WaitableCommand {
    @riggerIOC.inject(FightServer)
    private fightServer: FightServer;
}