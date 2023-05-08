# The Portal Test

A command line utility that is supposed to solve the given problem:

There are 52 bays in the warehouse lettered from A to AZ, each bay has 10 shelves for stock numbered from 1 to 10 (1 being lowest shelf, 10 being highest). For the purpose of this test the warehouse racking is in a long straight line and the items need to be picked in ascending order, i.e. starting at bay Aand finishing at bay AZ, each of the items should be picked from lowest to highest shelf (1-10).

Given a CSV input file with 3columns:
* product_code
* quantity
* pick_location

Find the optimal route through the warehouse.

# To Run the App

Redirect to the project directory and run:

```sh
npm install -g .
optimise-shelf-pickup -i input.csv -o output.csv
```

If no input filepath given, the program will read from `stdin`. If no output filepath given, the program will write into `stdout`.

For more informartion:
```sh
optimise-shelf-pickup --help
```
