import {getCurrectLineNum,get_node_array,get_block_condition, get_line_of_func_dec,get_line_numbers,create_lastBroDic,create_blocks_info,get_blocks} from './code-analyzer';

let index=1;
let first_node;
let linesToValMap;
let lines;
let nodeArray=[];
let visited_idx=new Set();
let block_info;
let blocks;
let lastBroDic;
let block_condition;
const set1 = new Set(['if statement', 'else-if statement', 'else statement', 'while statement']);


function set_globals(){
    linesToValMap=create_map_lines();
    lines=return_relevant_line();
    lines=lines.sort(function(a, b) {
        return a - b;
    });
    block_info=create_blocks_info();
    blocks= get_blocks();
    lastBroDic=create_lastBroDic();
    //update_lastBroDic = create_update_lastBroDic();
    block_condition=get_block_condition();
}

function empty_globals(){
    index=1;
    first_node=null;
    lines=[];
    nodeArray=[];
    visited_idx=new Set();
    block_info={};
    blocks=[];
    lastBroDic={};
    block_condition={};
    return true;
}
function create_map_lines(){
    let parsed_nodes_array=get_node_array();
    let linesToValMap=new Map();
    for(let i=0;i<parsed_nodes_array.length;i++){
        linesToValMap.set(parsed_nodes_array[i].Line,parsed_nodes_array[i]);
    }
    let func_dec_line=get_line_of_func_dec();
    linesToValMap.delete(func_dec_line);
    return linesToValMap;
}
function return_relevant_line(){
    let lineOfFuncDec = get_line_of_func_dec();
    let lines=get_line_numbers();
    let new_lines=[];
    for(let i=0;i<lines.length;i++){
        if(lines[i]!=lineOfFuncDec){
            new_lines.push(lines[i]);
        }
    }
    return new_lines.sort();
}
function create_node(line_num,line_type,bool){
    let node={};
    node.idx=index;
    node.line=line_num;
    node.type=getNodeType(line_type);
    node.values=[];
    node.next=null;
    node.nextTrue=null;
    node.nextFslse=null;
    node.isTrue=bool;
    index++;
    //node.bool=

    return node;
}
function getNodeType(line_type){
    if(line_type=='circle_node'){
        return 'circle_node';
    }
    else if(line_type=='if statement' || line_type== 'else-if statement'||line_type== 'while statement'){
        return 'condition_node';
    }
    else{
        return 'block_node';
    }
}
function get_line_value(line_val_json){

    if(set1.has(line_val_json.Type)){
        return line_val_json.Condition;
    } else if(line_val_json.Type=='return statement'){
        return 'return'+' '+line_val_json.Value;
    } else if(line_val_json.Type=='Update Expression') {
        return line_val_json.Name+line_val_json.Value;
    }else{
        return line_val_json.Name+'='+line_val_json.Value;
    }
}
function mainFuncAss3(){
    empty_globals();
    set_globals();
    let line_num=lines[0];
    first_node = create_node(line_num,linesToValMap.get(line_num).Type,true);
    let end_line = lines[lines.length-1];
    recursive_func(first_node,line_num,end_line,null);
    visited_idx.add(first_node.idx);
    checkEmptyLine(first_node);
    paintAllNodes(first_node);
    return create_graph(first_node);
}
function recursive_func(node,start_line,end_line,next_node) {
    let current_line = start_line;
    while (current_line <= end_line) {
        node.next = next_node;
        if (linesToValMap.get(current_line).Type == 'else statement') {
            current_line = get_next_line(current_line);
        }
        while (current_line <= end_line && !set1.has(linesToValMap.get(current_line).Type)) {
            let value = get_line_value(linesToValMap.get(current_line));
            node.values.push(value);
            current_line = get_next_line(current_line);
        }
        if (current_line <= end_line && linesToValMap.get(current_line).Type == 'if statement') {
            let circle_node = create_node(0, 'circle_node', false);
            if(node.line==current_line){
                rec_calls_ifs(node, current_line, circle_node);
                node.next == null;
            }
            else{
                let new_node = create_node(current_line, linesToValMap.get(current_line).Type, false);
                rec_calls_ifs(new_node, current_line, circle_node);
                node.next = new_node;
            }
            if(block_info.get(current_line).nextBro==null &&linesToValMap.has(block_info.get(current_line).parent) && set1.has(linesToValMap.get(block_info.get(current_line).parent).Type) && !set1.has(linesToValMap.get(get_next_line(get_end_of_block(current_line))).Type)){
                current_line = get_next_line(getCurrectLineNum2(lastBroDic.get(current_line)));
                circle_node.next = next_node;
            }
            else{
                current_line = get_next_line(getCurrectLineNum2(lastBroDic.get(current_line)));
                let temp_node = create_node(current_line, linesToValMap.get(current_line).Type, false);
                circle_node.next = temp_node;
                node = temp_node;
            }


        } else if (current_line <= end_line && linesToValMap.get(current_line).Type == 'else-if statement') {
            rec_calls_ifs(node, current_line, next_node);
            node.next = null;
            current_line = get_next_line(end_line);
        }else if (current_line <= end_line && linesToValMap.get(current_line).Type == 'while statement'){
            let null_node = create_node(0, 'null_node', false);
            null_node.values.push('NULL');
            let new_node = create_node(current_line, linesToValMap.get(current_line).Type, false);
            null_node.next=new_node;
            rec_calls_while(new_node,current_line,null_node);
            node.next=null_node;
            current_line= get_next_line(get_end_of_block(current_line));
            if(current_line<=end_line){
                let temp_node=create_node(current_line, linesToValMap.get(current_line).Type, false);
                new_node.nextFslse=temp_node;
                node = temp_node;
            }
            else
            {
                new_node.nextFslse=next_node;
            }
        }
    }
}
function rec_calls_ifs(node, current_line,circle_node){
    node.values.push(get_line_value(linesToValMap.get(current_line)));
    let true_node_type=linesToValMap.get(get_next_line(current_line)).Type;
    let trueNode = create_node(get_next_line(current_line),true_node_type,false);
    node.nextTrue=trueNode;
    if(block_info.get(current_line).nextBro!=null){
        let new_line=block_info.get(current_line).nextBro;
        let falseNode = create_node(new_line,linesToValMap.get(new_line).Type,false);
        node.nextFslse=falseNode;
        recursive_func(falseNode,new_line,get_end_of_block(new_line),circle_node);
    }
    else{
        node.nextFslse = circle_node;
    }
    recursive_func(trueNode,get_next_line(current_line),get_end_of_block(current_line),circle_node);
}
function rec_calls_while(while_node,current_line,null_node) {
    while_node.values.push(get_line_value(linesToValMap.get(current_line)));
    null_node.next = while_node;
    let trueNode = create_node(get_next_line(current_line), linesToValMap.get(get_next_line(current_line)).Type, false);
    while_node.nextTrue = trueNode;
    recursive_func(trueNode, get_next_line(current_line), get_end_of_block(current_line), null_node);

}
// let nullNode = initNewNode(['NULL'],'assignment expression',false,curr);
// let ifNode = initNewNode([parsedCodeInDic.get(curr).Condition],parsedCodeInDic.get(curr).Type,false,curr);
// let nextTrue = initNewNode([],parsedCodeInDic.get(nextLine(curr)).Type,false,nextLine(curr));
// nullNode.Next = ifNode;
// ifNode.NextTrue = nextTrue;
// recursive(nextTrue , nextLine(curr),ifLines.get(curr).End,nullNode);
// node.Next = nullNode;
// curr = nextLine(ifLines.get(curr).End);
// if(curr <= endLine)
// {
//     let currNode = initNewNode([],parsedCodeInDic.get(curr).Type,false,curr);
//     ifNode.NextFalse = currNode;
//     node = currNode;
// }
function get_end_of_block(line){
    for(let i=0;i<blocks.length;i++){
        if(blocks[i].start==line){
            return blocks[i].end;
        }
    }
}
function get_next_line(line){
    for(let i=0;i<lines.length;i++){
        if (lines[i]==line){
            return lines[i+1];
        }
    }
}

function paintAllNodes(node){
    if(node.next==null && node.nextTrue==null && node.nextFslse==null){
        return;
    }
    if(node.nextTrue==null &&!visited_idx.has(node.next.idx)){
        let nextNode=node.next;
        nextNode.isTrue=true;
        visited_idx.add(nextNode.idx);
        paintAllNodes(nextNode);
    }
    else {
        printAllNodes2(node);
    }

}
function printAllNodes2(node){
    if(node.type=='condition_node'){
        let node_type = linesToValMap.get(node.line).Type;
        if(node_type!='while statement'){
            paint_if_statement(node);
        }else{
            paint_while_statement(node);
        }

    }
}
function paint_if_statement(node){
    let line=node.line;
    if(block_condition.get(line).bool==1){
        let nextNode=node.nextTrue;
        nextNode.isTrue=true;
        visited_idx.add(nextNode.idx);
        paintAllNodes(nextNode);
    }
    else{
        let nextNode=node.nextFslse;
        nextNode.isTrue=true;
        visited_idx.add(nextNode.idx);
        paintAllNodes(nextNode);

    }
}
function paint_while_statement(node){
    let line=node.line;
    if(block_condition.get(line).bool==1){
        let nextNode=node.nextTrue;
        nextNode.isTrue=true;
        visited_idx.add(nextNode.idx);
        paintAllNodes(nextNode);
        if(node.isTrue==true){
            let nextNode=node.nextFslse;
            nextNode.isTrue=true;
            visited_idx.add(nextNode.idx);
            paintAllNodes(nextNode);
        }
    } else{
        let nextNode=node.nextFslse;
        nextNode.isTrue=true;
        visited_idx.add(nextNode.idx);
        paintAllNodes(nextNode);
    }
}
//----------------------------------------------------------------

function nodes_to_array(node){
    if(node!=null){
        if(nodeArray[node.idx]==null){
            nodeArray[node.idx]=node;
            nodes_to_array(node.nextTrue);
            nodes_to_array(node.nextFslse);
            nodes_to_array(node.next);
        }
    }
}
function checkEmptyLine(node)
{
    if (node.next!=undefined &&node.next.lines!=undefined && node.next.values.length==0)
        node.next=node.next.next;
    if (node.nextTrue!=undefined && node.nextTrue.lines!=undefined && node.nextTrue.values.length==0)
        node.true=node.true.next;
    if (node.nextFslse!=undefined && node.nextFslse.lines!=undefined && node.nextFslse.values.length==0)
        node.nextFslse=node.nextFslse.next;
    return node;
}
function string_to_Chart2(node,str){
    let content=get_values(node);
    let color=get_color(node);
    if(node.type=='block_node'){
        str+='node'+node.idx+'=>operation: '+content+'|'+color+'\n';
    }
    else if(node.type=='condition_node'){
        str+='node'+node.idx+'=>condition: '+content+'|'+color+'\n';
    }
    else if(node.type=='circle_node'){
        str+='node'+node.idx+'=>start: \'\'|'+color+'\n';
    }
    return str;

}
function string_to_Chart(){
    let str='';
    for(let i=0;i<nodeArray.length;i++) {
        let node = nodeArray[i];
        if (node == null) {
            continue;
        }
        str = string_to_Chart2(node,str);

    }
    return add_edges_to_string(str);
}
function add_edges_to_string(str){
    for(let i=0;i<nodeArray.length;i++){
        let node = nodeArray[i];
        if(node==null){
            continue;
        }
        if(node.type=='condition_node'){
            str=addCondEdge(str,node);
        }
        if (node.next!=null) {
            str+=addRegularEdge(node);
        }
    }
    return str;
}

function create_graph(node){
    nodes_to_array(node);
    return string_to_Chart();
}
function addRegularEdge(node){
    let next_node=node.next;
    return 'node'+node.idx+'->'+'node'+next_node.idx+'\n';
}
function addCondEdge(str,node){

    if(node.nextFslse!=null){
        let node_false = node.nextFslse;
        str+='node'+node.idx+'('+'no'+')->'+'node'+node_false.idx+'\n';
    }
    if(node.nextTrue!=null){
        let node_True = node.nextTrue;
        str+='node'+node.idx+'('+'yes'+',right)->'+'node'+node_True.idx+'\n';
    }
    return str;
}
function get_values(node){
    let str='';
    for(let i=0;i<node.values.length;i++){
        str+=node.values[i]+'\n';
    }
    return str;
}
function get_color(node){
    if(node.isTrue){
        return 'green';
    }
    else
        return 'white';
}
function getCurrectLineNum2(lineNum) {
    if (lines.includes(lineNum)) {
        return lineNum;
    }
    let i = 0;
    while (lines[i] < lineNum) {
        i++;
    }
    return lines[i-1];
}



export {create_map_lines};
export{mainFuncAss3};
export {empty_globals};

