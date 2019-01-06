import assert from 'assert';
import {parseCode,assignment2,} from '../src/js/code-analyzer';
import {mainFuncAss3, create_map_lines} from '../src/js/cfg';


describe('The javascript parser',() => {
    it('check function if else', () => {
        var code="function foo(x, y, z){\n" +
            "    let a = x + 1;\n" +
            "    let b = a + y;\n" +
            "    let c = 0;\n" +
            "    \n" +
            "    if (b < z) {\n" +
            "        c = c + 5;\n" +
            "    } else {\n" +
            "        c = c + z + 5;\n" +
            "    }\n" +
            "    \n" +
            "    return c;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>start: ''|green\n" +
            "node3=>condition: b<z\n" +
            "|green\n" +
            "node4=>operation: c=c+5\n" +
            "|white\n" +
            "node5=>operation: c=c+z+5\n" +
            "|green\n" +
            "node6=>operation: return c\n" +
            "|green\n" +
            "node1->node3\n" +
            "node2->node6\n" +
            "node3(no)->node5\n" +
            "node3(yes,right)->node4\n" +
            "node4->node2\n" +
            "node5->node2\n";
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});
describe('The javascript parser',() => {
    it('check function while', () => {
        var code="function foo(x, y, z){\n" +
            "   let a = x + 1;\n" +
            "   let b = a + y;\n" +
            "   let c = 0;\n" +
            "   \n" +
            "   while (a < z) {\n" +
            "       c = a + b;\n" +
            "       z = c * 2;\n" +
            "       a++;\n" +
            "   }\n" +
            "   \n" +
            "   return z;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>operation: NULL\n" +
            "|green\n" +
            "node3=>condition: a<z\n" +
            "|green\n" +
            "node4=>operation: c=a+b\n" +
            "z=c*2\n" +
            "a++\n" +
            "|green\n" +
            "node5=>operation: return z\n" +
            "|green\n" +
            "node1->node2\n" +
            "node2->node3\n" +
            "node3(no)->node5\n" +
            "node3(yes,right)->node4\n" +
            "node4->node2\n";
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});
describe('The javascript parser',() => {
    it('check function if inside while ', () => {
        var code="function foo(x, y, z){\n" +
            "    let a = x + 1;\n" +
            "    let b = a + y;\n" +
            "    let c = 0;\n" +
            "          \n" +
            "    while (a < z) {\n" +
            "       c = a + b;\n" +
            "       if(a+1>b){\n" +
            "            z = c * 2;\n" +
            "       }\n" +
            "       a++;\n" +
            "    }\n" +
            "               \n" +
            "   return z;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>operation: NULL\n" +
            "|green\n" +
            "node3=>condition: a<z\n" +
            "|green\n" +
            "node4=>operation: c=a+b\n" +
            "a++\n" +
            "|green\n" +
            "node8=>operation: return z\n" +
            "|green\n" +
            "node1->node2\n" +
            "node2->node3\n" +
            "node3(no)->node8\n" +
            "node3(yes,right)->node4\n" +
            "node4->node2\n"
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});
describe('The javascript parser',() => {
    it('check function while inside if ', () => {
        var code="function foo(x, y, z){\n" +
            "   let a = x + 1;\n" +
            "   let b = a + y;\n" +
            "   let c = 0;\n" +
            "     \n" +
            "   if( b<z){\n" +
            "      a=a+1;   \n" +
            "      while (a < z) {\n" +
            "         c++;\n" +
            "      }\n" +
            "      c = c + 5;\n" +
            "   }else{\n" +
            "      c = c + z + 5; \n" +
            "   }\n" +
            "   return z;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>start: ''|green\n" +
            "node3=>condition: b<z\n" +
            "|green\n" +
            "node4=>operation: a=a+1\n" +
            "|white\n" +
            "node5=>operation: c=c+z+5\n" +
            "|green\n" +
            "node6=>operation: NULL\n" +
            "|white\n" +
            "node7=>condition: a<z\n" +
            "|white\n" +
            "node8=>operation: c++\n" +
            "|white\n" +
            "node9=>operation: c=c+5\n" +
            "|white\n" +
            "node10=>operation: return z\n" +
            "|green\n" +
            "node1->node3\n" +
            "node2->node10\n" +
            "node3(no)->node5\n" +
            "node3(yes,right)->node4\n" +
            "node4->node6\n" +
            "node5->node2\n" +
            "node6->node7\n" +
            "node7(no)->node9\n" +
            "node7(yes,right)->node8\n" +
            "node8->node6\n" +
            "node9->node2\n";
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});
describe('The javascript parser',() => {
    it('check function return_lines_map ', () => {
        var code="function foo(x, y, z){\n" +
            "   let a = x + 1;\n" +
            "   let b = a + y;\n" +
            "   let c = 0;\n" +
            "   \n" +
            "   while (a < z) {\n" +
            "       c = a + b;\n" +
            "       z = c * 2;\n" +
            "       a++;\n" +
            "   }\n" +
            "   \n" +
            "   return z;\n" +
            "}\n";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans='b';
        var str =mainFuncAss3();
        let lines_map=create_map_lines()
        assert.equal(lines_map.get(3).Name,ans);

    });
});
describe('The javascript parser',() => {
    it('check function if and after if ', () => {
        var code="function foo(x, y, z){\n" +
            "    let a = x + 1;\n" +
            "    let b = a + y;\n" +
            "    let c = 0;\n" +
            "    \n" +
            "    if (b < z * 2) {\n" +
            "        c = c + 5;\n" +
            "    } \n" +
            "    c=c+1;\n" +
            "    if(c>b){\n" +
            "        c = c + z + 5;\n" +
            "    }\n" +
            "    \n" +
            "    return c;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>start: ''|green\n" +
            "node3=>condition: b<z*2\n" +
            "|green\n" +
            "node4=>operation: c=c+5\n" +
            "|green\n" +
            "node5=>operation: c=c+1\n" +
            "|green\n" +
            "node6=>start: ''|green\n" +
            "node7=>condition: c>b\n" +
            "|green\n" +
            "node8=>operation: c=c+z+5\n" +
            "|green\n" +
            "node9=>operation: return c\n" +
            "|green\n" +
            "node1->node3\n" +
            "node2->node5\n" +
            "node3(no)->node2\n" +
            "node3(yes,right)->node4\n" +
            "node4->node2\n" +
            "node5->node7\n" +
            "node6->node9\n" +
            "node7(no)->node6\n" +
            "node7(yes,right)->node8\n" +
            "node8->node6\n";
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});
describe('The javascript parser',() => {
    it('check function while and if and inside if ', () => {
        var code="function foo(x, y, z){\n" +
            "   let a = x + 1;\n" +
            "   let b = a + y;\n" +
            "   let c = 0;\n" +
            "   \n" +
            "   if (b < z) {\n" +
            "       a=a+1;\n" +
            "       while ( a<z ){\n" +
            "          c++;\n" +
            "       }\n" +
            "       c = c + 5;\n" +
            "       if(a+1>b){\n" +
            "       z = c * 2;\n" +
            "       }\n" +
            "    }else{\n" +
            "        c = c + z + 5\n" +
            "    }   \n" +
            "   return c;\n" +
            "}";
        var input= '1,2,3';
        parseCode(code);
        var newLinesToShow =assignment2(input,code);
        let ans="node1=>operation: a=x+1\n" +
            "b=a+y\n" +
            "c=0\n" +
            "|green\n" +
            "node2=>start: ''|green\n" +
            "node3=>condition: b<z\n" +
            "|green\n" +
            "node4=>operation: a=a+1\n" +
            "|white\n" +
            "node5=>operation: c=c+z+5\n" +
            "|green\n" +
            "node6=>operation: NULL\n" +
            "|white\n" +
            "node7=>condition: a<z\n" +
            "|white\n" +
            "node8=>operation: c++\n" +
            "|white\n" +
            "node9=>operation: c=c+5\n" +
            "|white\n" +
            "node10=>start: ''|white\n" +
            "node11=>condition: a+1>b\n" +
            "|white\n" +
            "node12=>operation: z=c*2\n" +
            "|white\n" +
            "node13=>operation: |white\n" +
            "node14=>operation: return c\n" +
            "|green\n" +
            "node1->node3\n" +
            "node2->node14\n" +
            "node3(no)->node5\n" +
            "node3(yes,right)->node4\n" +
            "node4->node6\n" +
            "node5->node2\n" +
            "node6->node7\n" +
            "node7(no)->node9\n" +
            "node7(yes,right)->node8\n" +
            "node8->node6\n" +
            "node9->node11\n" +
            "node10->node13\n" +
            "node11(no)->node10\n" +
            "node11(yes,right)->node12\n" +
            "node12->node10\n";
        var str =mainFuncAss3();
        assert.equal(str,ans);

    });
});

