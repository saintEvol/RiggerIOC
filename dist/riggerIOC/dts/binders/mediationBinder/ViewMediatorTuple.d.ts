/**
* View和Mediator的绑定元组
*/
declare module riggerIOC {
    class ViewMediatorTuple {
        view: View;
        mediator: Mediator;
        constructor(view: View, mediator: Mediator);
        dispose(): void;
    }
}
