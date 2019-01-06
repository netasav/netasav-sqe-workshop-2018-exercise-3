// import assert from 'assert';
// import {parseCode,assignment2,} from '../src/js/code-analyzer';
//
//
// describe('The javascript parser',() => {
//     it('is parsing an empty function correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('')),
//             '[]'
//         );
//     });
//     it('is parsing a simple variable declaration correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let a = 1;')),
//             '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":1}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a function declaration with variables and return correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('function binarySearch(X){return 1}')),
//             '[{"Line":1,"Type":"return statement","Name":"","Condition":"","Value":1},{"Line":1,"Type":"Function declaration","Name":"binarySearch","Condition":"","Value":""},{"Line":1,"Type":"variable declaration","Name":"X","Condition":"","Value":""}]'
//         );
//     });
//     it('is parsing return update expression correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('i++')),
//             '[{"Line":1,"Type":"Update Expression","Name":"i","Condition":"","Value":"++"}]'
//         );}
//     );
// });
// describe('The javascript parser',() => {
//     it('is parsing return update expression correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('++i')),
//             '[{"Line":1,"Type":"Update Expression","Name":"i","Condition":"","Value":"++"}]'
//         );
//     });
//     it('is parsing a empty init variable declaration  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let a;')),
//             '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":null}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a memberExpression essignment + literal correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('arr[o]=1')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"arr[o]","Condition":"","Value":1}]'
//         );
//     });
//     it('is parsing assignment to memberExpression   correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('x=arr[o]')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"arr[o]"}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a memberExpression assignment + identifyer  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('arr[o]=x')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"arr[o]","Condition":"","Value":"x"}]'
//         );
//     });
//     it('is parsing a assignmet complex binary expression left correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('x=(arr[i]+1)/2')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"arr[i]+1/2"}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a assignmet complex2 binary expression left correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('x=(y+z)/((f+1)/(f-1))')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"y+z/f+1/f-1"}]'
//         );
//     });
//     it('is parsing a  memberExpression in binary expression  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('x=arr[i]+1')),
//             '[{"Line":1,"Type":"Assignment Expression","Name":"x","Condition":"","Value":"arr[i]+1"}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a  essignment + binary expression  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('let x=y+1;')),
//             '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":"y+1"}]'
//         );
//     });
//
//     it('is parsing a  while statment  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('while(i>1){x++}')),
//             '[{"Line":1,"Type":"Update Expression","Name":"x","Condition":"","Value":"++"},{"Line":1,"Type":"while statement","Name":"","Condition":"i>1","Value":""}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('is parsing a  if statment  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('if(i>1){x++}')),
//             '[{"Line":1,"Type":"Update Expression","Name":"x","Condition":"","Value":"++"},{"Line":1,"Type":"if statement","Name":"","Condition":"i>1","Value":""}]'
//         );
//     });
//     it('is parsing a  for statment  correctly', () => {
//         assert.equal(
//             JSON.stringify(parseCode('for(let i=0;i<5;i++){let x=1}')),
//             '[{"Line":1,"Type":"variable declaration","Name":"i","Condition":"","Value":0},{"Line":1,"Type":"Update Expression","Name":"i","Condition":"","Value":"++"},{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":1},{"Line":1,"Type":"for statement","Name":"","Condition":"i<5","Value":""}]'
//         );
//     });
//     it('is parsing a  return statment  correctly + unary expression', () => {
//         assert.equal(
//             JSON.stringify(parseCode('function testFunc(){return -1}')),
//             '[{"Line":1,"Type":"return statement","Name":"","Condition":"","Value":"-1"},{"Line":1,"Type":"Function declaration","Name":"testFunc","Condition":"","Value":""}]'
//         );
//     });
// });
// describe('The javascript parser',() => {
//     it('ifunction1 no array', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    if (b < z) {\n' +
//              '        c = c + 5;\n' +
//              '        return x + y + z + c;\n' +
//              '    } else if (b < z * 2) {\n' +
//              '        c = c + x + 5;\n' +
//              '        return x + y + z+ c;\n' +
//              '    } else {\n' +
//              '        c = c + z + 5;\n' +
//              '        return x + y + z + c;\n' +
//              '    }\n' +
//              '}';
//         var input= '1,2,3';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,0,2,1,2,0,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('function1 withArray', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    if (b < z[0]) {\n' +
//              '        c = c + 5;\n' +
//              '        return x + y + z[0] + c;\n' +
//              '    } else if (b < z[0] * 2) {\n' +
//              '        c = c + x + 5;\n' +
//              '        return x + y + z[0] + c;\n' +
//              '    } else {\n' +
//              '        c = c + z[0] + 5;\n' +
//              '        return x + y + z[0] + c;\n' +
//              '    }\n' +
//              '}\n';
//         var input= '1,2,[3,4,5]';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,0,2,1,2,0,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('function2 nohArray', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    while (a < z) {\n' +
//              '        c = a + b;\n' +
//              '        z = c * 2;\n' +
//              '    }\n' +
//              '    \n' +
//              '    return z;\n' +
//              '}';
//         var input= '1,2,3';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,1,2,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('else statement is true', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    if (b < z) {\n' +
//              '        c = c + 5;\n' +
//              '        return x + y + z + c;\n' +
//              '    } else {\n' +
//              '        c = c + z + 5;\n' +
//              '        return x + y + z + c;\n' +
//              '    }\n' +
//              '}';
//         var input= '1,2,3';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,0,2,1,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('array as middle param ', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1; \n' +
//              '    let b = a + y[0]; \n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    if (b < z) {\n' +
//             '        c = c + 5;\n' +
//              '        return x + y[0] + z + c;\n' +
//              '    } else if (b < z * 2) {\n' +
//              '        c = c + x + 5;\n' +
//              '        return x + y[0] + z + c;\n' +
//              '    } else {\n' +
//              '        c = c + z + 5;\n' +
//              '        return x + y[0] + z + c;\n' +
//              '    }\n' +
//              '}';
//         var input= '1,[2,3,4],5';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,1,2,0,2,0,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('global var ', () => {
//         var code='let z1=1\n' +
//              'function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c =z1+ 0;\n' +
//              '    \n' +
//              '    while (a < z) {\n' +
//              '        c = a + b;\n' +
//              '        z = c * 2;\n' +
//              '    }\n' +
//              '    \n' +
//              '    return z;\n' +
//              '}\n';
//         var input= '1,2,3';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,2,1,2,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('if else inside while ', () => {
//         var code='function foo(x, y, z){\n' +
//             '    let a = x + 1;\n' +
//             '    let b = a + y;\n' +
//             '    let c = 0;\n' +
//             '\n' +
//             '    while (a < z) {\n' +
//             '        if(a+b<z){\n' +
//             '          c = a + b;\n' +
//             '          z = c * 2;\n' +
//             '        }else{\n' +
//             '           c=a+c;\n' +
//             '           z=c;\n' +
//             '        }\n' +
//             '    }\n' +
//             '   return z;\n' +
//             '}';
//         var input= '1,2,5';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,1,0,2,1,2,2]);
//     });
// });
// describe('The javascript parser',() => {
//     it('&& inside condition', () => {
//         var code='function foo(x, y, z){\n' +
//              '    let a = x + 1;\n' +
//              '    let b = a + y;\n' +
//              '    let c = 0;\n' +
//              '    \n' +
//              '    while ((a < z) && (a<b)) {\n' +
//              '          c = a + b;\n' +
//              '          z = c * 2;\n' +
//              '    }  \n' +
//              '    return z;\n' +
//              '}';
//         var input= '1,2,5';
//         parseCode(code);
//         var colors=[];
//         var newLinesToShow =assignment2(input,code);
//         for(let i=0;i<newLinesToShow.length;i++){
//             colors.push(newLinesToShow[i].bool);
//         }
//         assert.deepEqual(colors,[2,1,2,2]);
//     });
// });
