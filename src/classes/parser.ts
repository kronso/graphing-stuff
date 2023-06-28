import Stack from "./stack";
import Queue from "./queue";
    
// Uses the Shunting yard algorithm
// https://en.wikipedia.org/wiki/Shunting_yard_algorithm
export default class Parser {
    public stack = new Stack<number | string>;
    public queue = new Queue<number | string>;
    // Key represents operator,
    // Value represent associativity
    private precedence: {[key: string]: number} = {
        "(": 3, ")": 3, // P
        "^": 2,         // E
        "*": 1, "/": 1, // MD
        "+": 0, "-": 0  // AS
    }
    // Bro I don't know if '^' should be left or right assoc
    // because other website make it seem like it's left wtf.
    private assoc: {[key: string]: string} = {
        "(": "left", ")": "left", 
        "^": "right",
        "*": "left", "/": "left", 
        "+": "left", "-": "left",
    }
    // Stores an array of tokens
    private _tokens!: RegExpExecArray;
    
    // Takes an input string from the user and parses it.
    public constructor(private _string: string, private _substitute: number[], private _variables: string[]) {}

    bracketMultiplication() {
        this._tokens.forEach((token, idx) => {
            // ) * (var | num) * (
            if (this.isNumber(token) || this.isVariable(token)) {
                if (this._tokens[idx + 1] == "(") {     
                    this._tokens.splice(idx + 1, 0, "*");
                }
                // Changes -(x) to -1 * (x)
                if (this._tokens[idx - 2] == "-") {
                    if (!this.isNumber(this._tokens[idx - 3]) && !this.isVariable(this._tokens[idx - 3]) && this._tokens[idx - 3] != ")") {
                        this._tokens.splice(idx - 2, 1);
                        this._tokens.splice(idx - 2, 0, "*");
                        this._tokens.splice(idx - 2, 0, "-1");
                    }
                }
            }
            // ) * (
            if (token == ")" && this._tokens[idx + 1] == "(") {
                this._tokens.splice(idx + 1, 0, "*");
            }
        });
    }
    algebraicMultiplication() {
        for (let i = 0; i < this._tokens.length; i++) {
            if (this.isVariable(this._tokens[i]) || (this.isFunction(this._tokens[i]) && this._tokens[i] != "!")) {
                // x * (var | num)
                if (this.isVariable(this._tokens[i - 1]) || this.isNumber(this._tokens[i - 1]) || this.isConstant(this._tokens[i - 1]) || this._tokens[i - 1] == ")") {
                    this._tokens.splice(i, 0, "*");
                    i--;
                } 
            }
        }
    }
    // ([-+]?\d+(\.?\d+)?) => Denotes a number can be prefixed by + or -
    // and can be followed with a decimal and numbers to represent a floating point 
    isNumber(value: string): boolean {
        return /[-+]?\d+(\.?\d+)?/g.test(value);
    }
    // If token is a letter
    isVariable(value: string): boolean {
        return /[-+]?[a-zA-Z]/g.test(value) && !this.isFunction(value) && !this.isConstant(value);
    }
    isFunction(value: string): boolean {
        return /([-+]?sin|tan|cos|sqrt|abs|!)/g.test(value);
    }
    isConstant(value: string): boolean { 
        return /([-+]?e|pi)/g.test(value);
    }
    substituteVariable() {
        // substitude x with a value given from the constructor
        // or with a constant from the Math object
        this._tokens.forEach((token, index) => {
            if (this.isVariable(token)) {
                
                // Substitutes variables that scale with the Sliders
                this._variables.forEach((variable, var_idx) => {
                    if (token == variable) {
                        if (/[-]/g.test(token)) {
                            this._tokens[index] = `${-this._substitute[var_idx]}`;
                        } else {
                            this._tokens[index] = `${this._substitute[var_idx]}`;
                        }
                    }
                })
                // Substitutes the x or y values
                if (/[-+]?x+?/g.test(token) || /[-+]?y+?/g.test(token)) {
                    if (/[-]/g.test(token)) {
                        this._tokens[index] = `${-this._substitute[this._substitute.length - 1]}`;
                    } else {
                        this._tokens[index] = `${this._substitute[this._substitute.length - 1]}`;
                    }
                }
            } else if (this.isConstant(token)) {
                if (/[-]/g.test(token)) {
                    switch(token) {
                        case "-e": this._tokens[index] = `${-Math.E}`; break;
                        case "-pi": this._tokens[index] = `${-Math.PI}`; break;
                    }
                } else {
                    switch(token) {
                        case "e":  case "+e": this._tokens[index] = `${Math.E}`; break;
                        case "pi":  case "+pi": this._tokens[index] = `${Math.PI}`; break;
                    }
                }
            }
        })
    }
    // Converts the sequence of tokens into postfix
    infixToPostfix() {
        /* this._string MUST HAVE NO WHITESPACE FOR THIS TO WORK */
        this._string = this._string.replace(/\s/g, "");
        // A hell of a long regex to parse the input string
        this._tokens = <RegExpExecArray>this._string.match(
            /(?<=\*|\/|\+|-|\(|\)|\^|[a-zA-Z]?)([-+]?sin|tan|cos|sqrt|abs|e|pi)|(?<=\*|\/|\+|-|\(|\^)([-+]?\d+(\.?\d+)?|[+-]?[a-zA-Z])|(\*|\/|\+|-|\(|\)|\^|!)|([a-zA-Z])/g
            );
        // Apply's mathematical semantic shit
        this.bracketMultiplication();
        this.algebraicMultiplication();
        // console.log(this._tokens);
        // Substitute given variables and/or constants 
        this.substituteVariable();
        // Converts sequence of tokens from infix to postfix
        this._tokens.forEach((token) => {
            if (this.isNumber(token)) { 
                // Always parse with float for accuracy and d.p.
                this.queue.push_front(parseFloat(token));
            } else {
                this.operatorConiditons(token);
            }
        });
        
        // Pushes leftover operands from stack to queue after input queue is empty
        while (!this.stack.empty()) {
            this.queue.push_front(this.stack.back());
            this.stack.pop();
        }
    }
    
    // Conditions that are needed to follow the Shunting yard algorithm
    operatorConiditons(operator: string) {
        if (operator == ")") {
            while (this.stack.back() != "(") {
                this.queue.push_front(this.stack.back());
                this.stack.pop();
                if (this.stack.empty()) { throw new Error("Unmatching parenthesis ')'") }
            }
            this.stack.pop(); // discard the opening parenthesis
        } else {
            while (this.stack.back() != "(" && (this.precedence[operator] < this.precedence[this.stack.back()] 
                    || (this.precedence[operator] == this.precedence[this.stack.back()] && this.assoc[operator] == "left"))) {
                this.queue.push_front(this.stack.back());
                this.stack.pop();
            }       
            this.stack.push(operator);
        }
    }
    arithmeticResult(operator: string, op2: number, op1: number) {
        switch(operator) {
            case "^": return op2 ** op1;
            case "*": return op2 * op1;
            case "/": return op2 / op1;
            case "+": return op2 + op1;
            case "-": return op2 - op1;
        }
    }
    functionResult(func: string, op1: number) {
        // Has to account for negation and no negatives
        switch(func) {
            case "sin": case "+sin":   return Math.sin(op1); 
            case "cos": case "+cos":   return Math.cos(op1);
            case "tan": case "+tan":   return Math.tan(op1);
            case "sqrt": case "+sqrt": return Math.sqrt(op1);
            case "abs": case "+abs": return Math.abs(op1);
            case "!": return factorial(op1);

            case "-sin":  return -Math.sin(op1); 
            case "-cos":  return -Math.cos(op1);
            case "-tan":  return -Math.tan(op1);
            case "-sqrt": return -Math.sqrt(op1);
            case "abs":  return -Math.abs(op1);
        }
    }
    calculate(): number {
        let op1: number = 0;
        let op2: number = 0;
        while (!this.queue.empty()) {
            if (typeof this.queue.front() === "number") {
                this.stack.push(this.queue.front());
                this.queue.pop_front();
            } else {
                if (this.isFunction(this.queue.front() as string)) {
                    op1 = <number>this.stack.back();
                    this.stack.pop();
                    this.stack.push(<number>this.functionResult(<string>this.queue.front(), op1));
                    this.queue.pop_front();
                } else {
                    op1 = <number>this.stack.back();
                    this.stack.pop();
                    op2 = <number>this.stack.back();
                    this.stack.pop();
                    this.stack.push(<number>this.arithmeticResult(<string>this.queue.front(), op2, op1));
                    this.queue.pop_front();
                }

            }
        }
        return this.stack.back() as number;  
    }
    // Returns non-duplicate, non x and y variables 
    // ... to display sliders that effect the variable respectively
    getVariables() {
        this._string = this._string.replace(/\s/g, "");
        this._tokens = <RegExpExecArray>this._string.match(
            /(?<=\*|\/|\+|-|\(|\)|\^|[a-zA-Z]?)([-+]?sin|tan|cos|sqrt|abs|e|pi)|(?<=\*|\/|\+|-|\(|\^)([-+]?\d+(\.?\d+)?|[+-]?[a-zA-Z])|(\*|\/|\+|-|\(|\)|\^)|([a-zA-Z])/g
            );
        // Stores all variables that are not 'x' or 'y'
        let all_variables: string[] = [];
        if (this._tokens === null) return [];
        for (let i = 0; i < this._tokens.length; i++) {
            if (this.isVariable(this._tokens[i]) && !this.isConstant(this._tokens[i]) 
            && this._tokens[i] != "x" && this._tokens[i] != "-x" && this._tokens[i] != "y" && this._tokens[i] != "-y") {
                all_variables.push(this._tokens[i]);
            }
        }
        // Removes duplicates
        const variables = all_variables.filter((element, index) => {
            return all_variables.indexOf(element) === index;
        });
        return variables;
    }
}
// https://stackoverflow.com/questions/3959211/what-is-the-fastest-factorial-function-in-javascript
// Iterative
function factorial(num: number): number
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}