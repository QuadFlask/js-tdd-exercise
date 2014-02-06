function VendingMachine() {
	this.stock = {};
	this.balanceAmount = 0;
	this.price = {};
}

VendingMachine.prototype = {
	buy: function (beverage) {
		if (this.hasStock(beverage) && this.hasEnoughBalance(beverage)) {
			this.stock[beverage]--;
			this.balanceAmount -= this.price[beverage];
			return beverage;
		}

		return null;
	},
	hasStock: function (beverage) {
		return this.stock[beverage] > 0;
	},
	hasEnoughBalance: function (beverage) {
		return this.balanceAmount >= this.price[beverage];
	},
	supply: function (stock) {
		this.stock = stock;
	},
	insertCoin: function (amount) {
		this.balanceAmount += amount;
	},
	balance: function () {
		return this.balanceAmount;
	},
	setPrice: function (price) {
		this.price = price;
	}
}

$(function () {

	var vendingMachine = null;

	module('vendingMachine', {
		setup: function () {
			vendingMachine = new VendingMachine();
			vendingMachine.supply({
				"Coke": 1,
				"Sprite": 1,
				"Apple Juice": 1,
				"Orange Juice": 1,
				"NotExistDrink": 0
			});
			vendingMachine.setPrice({
				"Coke": 500,
				"Sprite": 300,
				"Apple Juice": 200,
				"Orange Juice": 100,
			});
		},
		teardown: function () {
			vendingMachine = null;
		}
	});

	test("buy drink what you want", function () {
		// Given
		vendingMachine.insertCoin(10000);

		// When
		var beverage1 = vendingMachine.buy("Coke");
		var beverage2 = vendingMachine.buy("Sprite");
		var beverage3 = vendingMachine.buy("Apple Juice");
		var beverage4 = vendingMachine.buy("Orange Juice");
		// Then
		equal(beverage1, "Coke");
		equal(beverage2, "Sprite");
		equal(beverage3, "Apple Juice");
		equal(beverage4, "Orange Juice");
	});

	test("can buy only coke, sprite, apple juice and orange juice", function () {
		vendingMachine.insertCoin(10000);
		var beverage1 = vendingMachine.buy("NotExistDrink");

		equal(beverage1, null);
	});

	test("can buy only remain beverage", function () {
		vendingMachine.supply({
			"Coke": 1
		});
		vendingMachine.insertCoin(10000);

		var beverage1 = vendingMachine.buy("Coke");
		var beverage2 = vendingMachine.buy("Coke");

		equal(beverage1, "Coke");
		equal(beverage2, null);
	});

	test("insert coin many times", function () {
		vendingMachine.insertCoin(500);
		vendingMachine.insertCoin(100);

		equal(vendingMachine.balance(), 600);
	});

	test("can buy drink at most u insert coins", function () {
		vendingMachine.supply({
			"Coke": 100
		});
		vendingMachine.insertCoin(500);

		var beverage1 = vendingMachine.buy("Coke");
		var beverage2 = vendingMachine.buy("Coke");

		equal(beverage1, "Coke");
		equal(beverage2, null);
	});

	test("set price for each drink", function () {
		vendingMachine.insertCoin(800);
		vendingMachine.setPrice({
			"Coke": 500,
			"Sprite": 300
		});

		equal(vendingMachine.buy("Coke"), "Coke");
		equal(vendingMachine.buy("Sprite"), "Sprite");
		equal(vendingMachine.buy("Sprite"), null);
	});

});