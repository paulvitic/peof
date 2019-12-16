import Confirmable from "../../src/examples/decorator";

class IceCreamComponent {

    toppings: string[] = [];

    @Confirmable('Are you sure?')
    @Confirmable('Are you super, super sure? There is no going back!')
    addTopping(topping: string) {
        this.toppings.push(topping);
        console.log(`toppings are ${this.toppings}`)
    }

}

test('should get failure value', () => {
    let iceCream = new IceCreamComponent();
    iceCream.addTopping("chocolate");
});
