import $ from 'jquery';
import {parseCode, assignment2,} from './code-analyzer';
import {mainFuncAss3,empty_globals,create_map_lines} from './cfg';
import * as flowchart from 'flowchart.js';

var diagram;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let params= $('#params').val();
        let parsedCode = parseCode(codeToParse);
        let newTextArray= assignment2(params,codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        tokensTable(parsedCode);
        tableAss2(newTextArray);
        let str_for_graph=mainFuncAss3();
        let lines_map = create_map_lines();
        draw_floeChart(str_for_graph);
    });
});

function tokensTable(parsedCode){
    let table= document.getElementById('ans_table');
    emptyTable(table);
    for(let i=1;i<parsedCode.length;i++) {
        var row = table.insertRow(i);
        var line_cell = row.insertCell(0);
        var type_cell = row.insertCell(1);
        var name_cell = row.insertCell(2);
        var condition_cell = row.insertCell(3);
        var value_cell = row.insertCell(4);
        line_cell.textContent = parsedCode[i].Line;
        type_cell.textContent = parsedCode[i].Type;
        name_cell.textContent = parsedCode[i].Name;
        condition_cell.textContent = parsedCode[i].Condition;
        value_cell.textContent = parsedCode[i].Value;

    }
}
function emptyTable(table) {
    let table_length=table.rows.length;
    for (let i=table_length-1;i>0;i--)
    {
        table.deleteRow(i);
    }
}

function tableAss2(newTextArray){
    let table= document.getElementById('ans2_table');
    emptyTable(table);
    //let newTextArray=textAfterParse(codeToParse);
    for(let i=0;i<newTextArray.length;i++){
        var row = table.insertRow(i);
        row.textContent = newTextArray[i].text;
        //let line=newTextArray[i].line;
        if(newTextArray[i].bool==1){
            row.className='trueValues';
        }
        else if (newTextArray[i].bool==0){
            row.className='falseValue';
        }
    }
    // let tempy =get_temp_nodes();
    //console.log('get_temp_nodes');
}
function draw_floeChart(str)
{
    diagram = flowchart.parse(str);
    diagram.drawSVG('diagram', {
        'x': 0, 'y': 0,
        'line-width': 3, 'line-length': 50, 'text-margin': 10, 'font-size': 14, 'font-color': 'black', 'line-color': 'black',
        'element-color': 'black', 'fill': 'white', 'yes-text': 'T', 'no-text': 'F', 'arrow-end': 'block', 'scale': 1,
        'symbols': {
            'start': {
                'font-color': 'red', 'element-color': 'green', 'fill': 'yellow'
            },
            'end':{
                'class': 'end-element'
            }
        },
        'flowstate' : {
            'green' : { 'fill' : 'green'}, 'white': {'fill' : 'white'}
        }
    });
}



