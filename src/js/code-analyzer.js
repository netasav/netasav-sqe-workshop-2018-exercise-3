import * as esprima from 'esprima';
export {parseCode,assignment2,insertLinesToPrint,returnLinesDic,getParamsNameArray,textAfterParse,merge_condition_with_brothers,getCurrectLineNum};
export {get_blocks,get_node_array,get_line_of_func_dec,get_line_numbers,get_block_condition,create_blocks_info,get_block_brothers,create_lastBroDic};


let parsed_nodes = [];
let nodes_after_parse=[];
let blocks=[];
let func_declaration_line;
let block_condition = new Map();
let params=[];


const parseCode = (codeToParse) => {
    blocks=[],params=[], block_condition = new Map();;
    let parsedCode =esprima.parseScript(codeToParse,{loc: true}, function(node,metadata){
        if(node.type=='FunctionDeclaration') {
            FuncDec_func(node,metadata);
        }
        else if(node.type=='VariableDeclarator') {
            varDec_func(node,metadata);
        }
        else {
            countinueFunc1(node,metadata);
        }
    });
    parsed_nodes= SortParsed(parsed_nodes);
    remove_doubles();
    nodes_after_parse = parsed_nodes;
    parsedCode= parsed_nodes;
    parsed_nodes = [];
    return parsedCode;
};
//function declaration
function FuncDec_func(node,metadata){
    func_declaration_line=metadata.start.line;
    pushNode(metadata.start.line,'Function declaration',node.id.name,'','');
   // blockCondition(metadata.start.line,'Function declaration','');
    for(let i=0; i<node.params.length;i++) {
        pushNode(metadata.start.line,'variable declaration',node.params[i].name,'','');
        params.push({name:node.params[i].name,column:node.params[i].loc.start.column});
    }
}
function sortParams(){
    params.sort(sortByProperty('column'));
}
//variable declaration
function varDec_func(node,metadata){
    let init=null;
    if(node.init!=null){
        init=expresrionPars(node.init);
    }
    pushNode(metadata.start.line,'variable declaration',node.id.name,'',init);
}
//UpdateExpression, AssignmentExpression, IfStatement
function countinueFunc1(node,metadata){
    if(node.type=='UpdateExpression') {
        let name=expresrionPars(node.argument);
        pushNode(metadata.start.line,'Update Expression',name,'',node.operator);
    }
    else if(node.type=='AssignmentExpression') {
        let name, value;
        name= assignmentExpressionNameVal(node.left);
        value=assignmentExpressionValue(node.right);
        pushNode(metadata.start.line,'Assignment Expression',name,'',value);
    }
    else if(node.type=='IfStatement') {
        ifStatementFunc(node,metadata);
    }
    else{
        continueFunc2(node,metadata);
    }

}
//if statement
//used by countinueFunc1
function ifStatementFunc(node,metadata){
    let condition=expresrionPars(node.test);
    pushNode(metadata.start.line,'if statement','',condition,'');
    if (node.alternate!= null)
        else_if_statement(node.alternate);

}
//in case of else if statement
function else_if_statement(node){
    if (node.type=='IfStatement')
    {
        let condition=expresrionPars(node.test);
        pushNode(node.loc.start.line,'else-if statement','',condition,'');
        //insert_if_block_length(node);
        if (node.alternate!= null)
            else_if_statement(node.alternate);
    }
    //else statement
    else{
        pushNode(node.loc.start.line,'else statement','','','');

    }
}
//WhileStatement, ForStatement, ReturnStatement, blockStatement
function  continueFunc2(node,metadata){
    if(node.type=='WhileStatement') {
        let condition=expresrionPars(node.test);
        pushNode(metadata.start.line,'while statement','',condition,'');
        blockCondition(metadata.start.line,'while statement',condition);
    }
    else if(node.type=='ForStatement') {
        let condition=expresrionPars(node.test);
        pushNode(metadata.start.line,'for statement','',condition,'');
        blockCondition(metadata.start.line,'for statement',condition);
    }
    else if(node.type=='ReturnStatement') {
        let value=expresrionPars(node.argument);
        pushNode(metadata.start.line,'return statement','','',value);
    }
    else if(node.type=='BlockStatement'){
        let block={start: node.loc.start.line, end: node.loc.end.line-1,lastBeforeBlock:'',parent:'',blockType:''};
        blocks.push(block);
    }
}
//sort array of json by one property
var sortByProperty = function (property) {
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
    };
};
//check if there is else-if statement in the same line as if statement it needs to br remove
function remove_doubles(){
    for(let i=0;i<parsed_nodes.length;i++){
        for(let j=i+1;j<parsed_nodes.length;j++){
            if(parsed_nodes[i].Line ==parsed_nodes[j].Line ) {
                check_if_double(i,j);
            }
        }
    }
}
//used by remove_doubles function
function check_if_double(i,j){
    if_ifElse(i,j);
    else_else(i,j);
}
//remove one statement of if/if-else
function if_ifElse(i,j){
    // if(parsed_nodes[i].Type=='else-if statement' && parsed_nodes[j].Type =='if statement')
    // {
    //     parsed_nodes.splice(j,1);
    // }
    if (parsed_nodes[i].Type=='if statement' && parsed_nodes[j].Type =='else-if statement')
    {
        parsed_nodes.splice(i,1);
    }
    else{
        return;
    }
}
//remove one statement of else/else
function else_else(i,j){
    if(parsed_nodes[i].Type=='else statement' && parsed_nodes[j].Type=='else statement')
    {
        parsed_nodes.splice(i,1);
    }
}
//return value for expression
function expresrionPars(node) {

    if(node.right==null && node.left==null) {
        return expresionValue(node);
    }
    else if(node.right!=null && node.left!=null) {
        return expresrionPars(node.left)+ node.operator + expresrionPars(node.right);
    }

}
//return the value of expression
//literal or identifier or unary expression
function expresionValue(node) {
    let value;
    if(node.type=='Literal') {
        value= node.value;
    }
    else if(node.type=='Identifier') {
        value= node.name;
    }
    else if(node.type=='UnaryExpression') {
        value=node.operator + node.argument.value;
    }
    else if(node.type=='MemberExpression')
    {
        value= node.object.name+'['+expresrionPars(node.property)+']';
    }
    return value;
}
//insert node values to main array
function pushNode(line,type,name,condition,value) {
    let nodeToPush={
        Line: line,
        Type: type,
        Name: name,
        Condition: condition,
        Value: value
    };
    parsed_nodes.push(nodeToPush);

}
//insert block condition with boolean value
function blockCondition(b_line ,b_type, b_condition){
    let nodeToPush={type:b_type, condition:b_condition, bool:1, visited:false};
    block_condition.set(b_line,nodeToPush);
}
function assignmentExpressionNameVal(node){
    return expresionValue(node);
}
function assignmentExpressionValue(node) {
    if (node.type == 'BinaryExpression') {
        return expresrionPars(node);
    }
    else if (node.type == 'MemberExpression') {
        return expresrionPars(node);
    }
    else {
        return expresionValue(node);

    }
}
//to sort the array by line number
function SortParsed(array) {
    array.sort(function(a, b){return a.Line - b.Line;});
    return array;
}

function IterateToSetconditionValue() {
    for(let i=0;i<nodes_after_parse.length;i++){
        if(nodes_after_parse[i].Type=='if statement'){
            blockCondition(nodes_after_parse[i].Line,'if statement',nodes_after_parse[i].Condition);
        }
        else if(nodes_after_parse[i].Type=='else-if statement'){
            blockCondition(nodes_after_parse[i].Line,'else-if statement',nodes_after_parse[i].Condition);
        }
        else if(nodes_after_parse[i].Type=='else statement'){
            blockCondition(nodes_after_parse[i].Line,'else statement','');

        }
    }
}


//********************************************************************************************************************
//part 2


let lines_map = new Map();        //holds for each line the most current locals value
let local_vars_map = new Map();
let line_numbers=[];
let block_brothers=new Map();



//main function for assingment2
//take initial values of local variables and for each line update local variables values
function assignment2(input_params,codeToParse) {
    emptyGlobals();
    IterateToSetconditionValue();
    blocks.sort(sortByProperty('start'));
    getAllLineNumbers();
    updateBlockValue();
    updateLastBeforeBlock();
    insert_locals();
    initParams(input_params);
    for (let i = 0; i < nodes_after_parse.length; i++) {
        let line = nodes_after_parse[i].Line;
        if(local_vars_map.has(nodes_after_parse[i].Name)) { //if var is in locals_map
            insert_line_dic(i,line);
        }
        else{
            if(!lines_map.has(line)){copyMapFromLastLine(line);}
        }
    }
    updateBlockBollVal();
    return textAfterParse(codeToParse);
}

//************************************//blocks updates
function splitInputLocalsToArray(input_locals){
    let temp_str='';
    let idx=0;
    let toReturn=[];
    while(idx<input_locals.length){
        idx=0;
        if(input_locals.charAt(idx)=='['){
            while(input_locals.charAt(idx)!=']'){
                idx++;
            }
            idx++;
            temp_str=input_locals.substring(0,idx);
            input_locals=input_locals.substring(idx+1,input_locals.length);
            toReturn.push({value:temp_str,isArray:true});
            idx=0;

        }
        else{
            let charOfDelimiter=input_locals.indexOf(',');
            if(charOfDelimiter==-1){
                toReturn.push({value:input_locals,isArray:false});
                return toReturn;
            }
            else{
                idx=charOfDelimiter+1;
                temp_str=input_locals.substring(0,charOfDelimiter);
                toReturn.push({value:temp_str,isArray:false});
                input_locals=input_locals.substring(idx,input_locals.length);
            }
        }
    }
    return toReturn;
}

function initParams(params) {
    let paramsArr = [];
    if (params.includes(']'))
        paramsArr = splitInputLocalsToArray(params);
    else {
        paramsArr = splitInputLocalsToArray_noArr(params);
    }
    insertParamsToInitialDic(paramsArr);
}
function insertParamsToInitialDic(paramsArr) {
    sortParams();
    let paramsLength =params.length;
    for (let i = 0; i < paramsLength; i++) {
        if(!paramsArr[i].isArray){
            local_vars_map.set(params[i].name, paramsArr[i].value);
        }
        else{
            let stringArr=paramsArr[i].value;
            let parramName=params[i].name;
            stringArr=stringArr.substring(1,stringArr.length-1);
            let arr=stringArr.split(',');
            for(let j=0;j<arr.length;j++){
                local_vars_map.set(parramName+'['+j+']',arr[j]);
                params.push({name:parramName+'['+j+']',column: ''});
            }
        }

    }
}
function splitInputLocalsToArray_noArr(params){
    let paramsTemp = params.split(',');
    let tpReturn=[];
    for(let i=0;i<paramsTemp.length;i++){
        tpReturn.push({value:paramsTemp[i],isArray:false});
    }
    return tpReturn;
}
//activate block information valurs
function updateBlockValue() {
    updateBlockParent();
    updateBlockStatementType();
    insertBlockBrothers();
}
//update statement type
function updateBlockStatementType() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        let b_type = getBlockType(blocks[i].start);
        blocks[i].blockType = b_type;
    }
}
//use by updateBlockStatementTyp function
function getBlockType(lineNum) {
    for (let i = 0; i < nodes_after_parse.length; i++) {
        if (nodes_after_parse[i].Line == lineNum) {
            return nodes_after_parse[i].Type;
        }
    }
}
//update parent
function updateBlockParent() {
    for (let i = blocks.length - 1; i >= 0; i--) {
        let b_parent = findParentBlobk(i);
        blocks[i].parent = b_parent;
    }
}
//used by updateBlockParent
function findParentBlobk(blockIdx) {
    for (let i = blockIdx - 1; i >= 0; i--) {
        if (blocks[i].start < blocks[blockIdx].start && blocks[i].end > blocks[blockIdx].end) {
            return blocks[i].start;
        }
    }
    return -1;
}
//insert for each parent block his childes
function insertBlockBrothers() {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].parent == -1) {
            continue;
        }
        else {
            if (block_brothers.has(blocks[i].parent)) {
                let brothers_list = block_brothers.get(blocks[i].parent);
                brothers_list.push(blocks[i].start);
                block_brothers.set(blocks[i].parent, brothers_list);
            }
            else {
                let brothers_list = [];
                brothers_list.push(blocks[i].start);
                block_brothers.set(blocks[i].parent, brothers_list);
            }
        }
    }
}

//**************************************

//insert to lines dictionary in case of function declaration or any node who is not local var
function copyMapFromLastLine(line) {
    if (line == func_declaration_line) {
        let localDic = new Map(local_vars_map);
        lines_map.set(line, localDic);
    }
    else {
        if (isStartOfBlock(line)) {
            let localDic = new Map(lines_map.get(getLastLineBeforeBlock(line)));
            lines_map.set(line, localDic);
        }
        else {
            let localDic = new Map(lines_map.get(getCurrectLineNum(line - 1)));
            lines_map.set(line, localDic);
        }
    }
}
//check if line is the first line of the block -->if so, it will be needed to take last line as last before block
function isStartOfBlock(line) {
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].start == line) {
            return true;
        }
    }
    return false;
}
//check if line is in block statement and return the idx of the correct block from blocks
function isInBlockStatement(line) {
    for (let i = blocks.length - 1; i > 0; i--) {
        if(blocks[i].start == line){
            return i;
        }
        else if (blocks[i].start <= line && blocks[i].end >= line) {
            return i;
        }
    }
}
//update last line befor block using getAllLineNumbers to change line numbers that are not in use
function updateLastBeforeBlock() {
    for (let i = blocks.length - 1; i > 0; i--) {
        let j = i;
        while (blocks[i].start > blocks[j-1].end) {
            j--;
        }
        if (line_numbers.includes(blocks[j].start - 1)) {
            blocks[i].lastBeforeBlock = blocks[j].start - 1;
        }
        else {
            if(has_prev_bro(blocks[i].start)!=-1){
                blocks[i].lastBeforeBlock = has_prev_bro(blocks[i].start);
            }
            else{
                blocks[i].lastBeforeBlock = getCurrectLineNum(blocks[i].start - 1);
            }

        }
    }
    // if (blocks[0].lastBeforeBlock == '') {
    //     blocks[0].lastBeforeBlock = blocks[0].start;
    // }
}
function has_prev_bro(line){
    for(let i=0;i<block_brothers.length;i++){
        let brother_list=block_brothers[i];
        for(let j=0;j<brother_list.length;j++){
            if(brother_list[j]==line){
                if(j!=0){
                    return brother_list[j];
                }
            }
        }
    }
    return -1;
}

//if line before lineNum is empty the function returns the first not empty line before lineNum
//in case that the line is not the first line of a block
function getCurrectLineNum(lineNum) {
    if (lineNum == 0) {
        return line_numbers[0];
    }
    if (line_numbers.includes(lineNum)) {
        return lineNum;
    }
    let i = line_numbers.length - 1;
    while (line_numbers[i] > lineNum) {
        i--;
    }
    return line_numbers[i];
}
//creates an array of all not empty line numbers
function getAllLineNumbers() {
    for (let i = 0; i < nodes_after_parse.length; i++) {
        let line = nodes_after_parse[i].Line;
        if (!line_numbers.includes(line)) {
            line_numbers.push(line);
        }
    }
    line_numbers.sort();
}
//go over all nodes and look for locals
function insert_locals() {
    for (let i = 0; i < nodes_after_parse.length; i++) {
        let var_name = nodes_after_parse[i].Name;
        if (isLocalVar(i) && !local_vars_map.has(var_name)) {
            insertLocalsInitiateValue(i);
        }
    }
}
//insert initial value '' to locals dictionary
function insertLocalsInitiateValue(i) {
    if (nodes_after_parse[i].Line < func_declaration_line) {
        local_vars_map.set(nodes_after_parse[i].Name, nodes_after_parse[i].Value);
    }
    else {
        local_vars_map.set(nodes_after_parse[i].Name, 'empty');
    }
}
//return the last not empty line before current block
function getLastLineBeforeBlock(line) {
    let blockCell = isInBlockStatement(line);
    return blocks[blockCell].lastBeforeBlock;
}
//insert to lines_dic when change is needed
//latest and most update values for each variable
//used by assignment2 function
function insert_line_dic(idx, line) {
    if(line==func_declaration_line){
        return;
    }
    let prevLine = getCurrectLineNum(line - 1);
    let localDic = new Map(lines_map.get(prevLine));
    if (localDic.size == 0) {
        localDic = local_vars_map;
    }
    //if(localDic[nodes_after_parse[idx].Name]){}
    let exp_val = nodes_after_parse[idx].Value;
    let exp = splitBinarryExpression(exp_val);
    for (let i = 0; i < exp.length; i++) {
        if (localDic.has(exp[i]) && localDic[nodes_after_parse[i].Name] != 'empty') {
            if (!isValueInParamArray(exp[i]))
                exp_val = exp_val.replace(exp[i], '(' + localDic.get(exp[i]) + ')');
        }
    }
    localDic.set(nodes_after_parse[idx].Name, exp_val);
    lines_map.set(line, localDic);
}
//check if node is local var
function isLocalVar(i) {
    if ((nodes_after_parse[i].Type == 'variable declaration' || nodes_after_parse[i].Type == 'Assignment Expression') && nodes_after_parse[i].Line != func_declaration_line) {
        return true;
    }
    else
        return false;
}
//split expression to array
function splitBinarryExpression(expression) {
    if (isNaN(expression)) {
        let res = expression.split(/[\s<>,=()*/;&|!{}%+-]+/).filter(a => a !== ' ');
        return res;
    }
    else {
        let res = [];
        res.push(expression);
        return res;
    }
}


//*******************************************************************************************************

function updateBlockBollVal(){
    var brothers_list;
    for (const key of block_brothers.keys()) {
        brothers_list = block_brothers.get(key);
        for(let i=0;i<brothers_list.length;i++){
            if(brothers_list.length>1){
                updateBlockValueWithBro(i,brothers_list);

            }
            else{
                updateBlockValueNoBro(i,brothers_list);

            }

        }
    }
}
function updateConditionBool(i,condition,line,brothers_list){
    if(eval(condition)){
        updateIfTrue(i+1,brothers_list,line);
    }
    else if(condition==''){ //in case of true else statement
        updateIfTrue(i+1,brothers_list,line);
    }
    else{updateIfFalse(line);}
}
function updateBlockValueWithBro(i,brothers_list){
    if(!block_condition.get(brothers_list[i]).visited){
        let line=brothers_list[i];
        let condition=updateBlockConditionValue(line,block_condition.get(line).condition);
        condition = replaceArgNames(condition,line);
        updateConditionBool(i,condition,line,brothers_list);
    }
}
function updateBlockValueNoBro(i,brothers_list){
    let line=brothers_list[0];
    let condition=updateBlockConditionValue(line,block_condition.get(line).condition);
    condition = replaceArgNames(condition,line);
    updateConditionBool(i,condition,line,brothers_list);
}
function replaceArgNames(condition,lineNum) {
    var array=splitBinarryExpression(condition);
    for (var token in array)
    {
        if (isValueInParamArray(array[token]))
            condition=condition.replace(array[token],getArgValue(array[token],lineNum));
    }
    return condition;
}
function getArgValue(name,lineNum) {
    let localDic=lines_map.get(lineNum);
    return localDic.get(name);

}
function updateIfFalse(line){
    let blockCondObj=block_condition.get(line);
    blockCondObj.bool=0;
    blockCondObj.visited=true;
    block_condition.set(line,blockCondObj);

}
function updateIfTrue(i,brothers_list,line){
    let blockCondObj=block_condition.get(line);
    blockCondObj.bool=1;
    blockCondObj.visited=true;
    block_condition.set(line,blockCondObj);
    for(i;i<brothers_list.length;i++){
        let brother_line=brothers_list[i];
        let blockBrotherCondObj=block_condition.get(brother_line);
        if(blockBrotherCondObj.type=='else-if statement' || blockBrotherCondObj.type=='else statement' ){
            blockBrotherCondObj.bool=0;
            blockBrotherCondObj.visited=true;
            block_condition.set(brother_line,blockBrotherCondObj);
        }
    }

}
function updateSonsBool(){
    for(const key of block_brothers.keys() ){
        let brother_list = block_brothers.get(key);
        for(let i=0;i<brother_list.length;i++){
            if(block_condition.has(key) && block_condition.get(key).bool==0){
                let brother=brother_list[i];
                let broObj=block_condition.get(brother);
                broObj.bool=block_condition.get(key).bool;
                block_condition.set(brother,broObj);
            }
        }
    }
}
function updateBlockConditionValue(lineNum,condition){

    let localDic=lines_map.get(lineNum);
    let exp_val= condition;
    let exp=splitBinarryExpression(exp_val);
    for(let i=0;i<exp.length;i++){
        let varName=exp[i];
        if(localDic.has(varName) && localDic.get(varName)!='empty' && !isValueInParamArray(varName)){
            let varVal=localDic.get(varName);
            exp_val= exp_val.replace(exp[i],'('+varVal+')');
        }
    }
    return exp_val;
}
function insertLinesToPrint3(linesToPrint,i,paramNames){
    if(nodes_after_parse[i].Type=='return statement'){
        linesToPrint.push(nodes_after_parse[i].Line);
    }
    else if(paramNames.includes(nodes_after_parse[i].Name)){ //if return statementLine or  parameter essingment
        // if(!linesToPrint.includes(nodes_after_parse[i].Line)){
        linesToPrint.push(nodes_after_parse[i].Line);
    }
    return linesToPrint;

}
function insertLinesToPrint2(linesToPrint,i,paramNames,globalsName){
    if( globalsName.includes(nodes_after_parse[i].Name)){ //if global or blockstatement
        if(!linesToPrint.includes(nodes_after_parse[i].Line)){
            linesToPrint.push(nodes_after_parse[i].Line);

        }
        return linesToPrint;
    }
    else if(ifBlocksContains(nodes_after_parse[i].Line)){
        if(!linesToPrint.includes(nodes_after_parse[i].Line)){
            linesToPrint.push(nodes_after_parse[i].Line);

        }
        return linesToPrint;
    }
    else{
        return insertLinesToPrint3(linesToPrint,i,paramNames,globalsName);
    }
}
function insertLinesToPrint(){
    let paramNames=getParamsNameArray();
    let globalsName=getGlobalsNameArray();
    let linesToPrint=[];
    for(let i=0;i<nodes_after_parse.length;i++){
        linesToPrint = insertLinesToPrint2(linesToPrint,i,paramNames,globalsName);

    }
    return linesToPrint;
}
function getParamsNameArray(){
    let paramName=[];
    for(let i=0;i<params.length;i++){
        paramName.push(params[i].name);
    }
    return paramName;
}
function isValueInParamArray(name) {
    let paramsNames=getParamsNameArray();
    for (var na in paramsNames)
        if (paramsNames[na]==name)
            return true;
    return false;
}
function ifBlocksContains(line){
    for(let i=0;i<blocks.length;i++){
        if(blocks[i].start==line){
            return true;
        }
    }
    return false;
}
function getGlobalsNameArray() {
    let lastFuncLine=-1;
    for(let i=0;i<blocks.length;i++){
        if(blocks[i].start==func_declaration_line){
            lastFuncLine=blocks[i].end;
        }
    }
    let globalsName=[];
    for(let i=0;i<nodes_after_parse.length;i++){
        if(nodes_after_parse[i].Line<func_declaration_line ||nodes_after_parse[i].Line>lastFuncLine ){
            globalsName.push(nodes_after_parse[i].Name);
        }
    }
    return globalsName;
}
function returnLinesDic(){
    return lines_map;
}
function emptyGlobals(){
    func_declaration_line;
    lines_map = new Map();        //holds for each line the most current locals value
    local_vars_map = new Map();
    line_numbers=[];
    block_brothers=new Map();

}
//*******************************************************************************************************
function textAfterParse(codeToParse){
    updateSonsBool()
    let arrayOfNewLines=[];
    let linesToPrint=insertLinesToPrint();
    let lines_map=returnLinesDic();
    let func_text_array= codeToParse.split('\n');
    for(let i=0;i<func_text_array.length;i++){
        if(linesToPrint.includes(i+1)){
            let localDic=lines_map.get(i+1);
            let newLine=replaceVals(func_text_array[i],localDic);
            let bool_V=2;
            if(block_condition.has(i+1)){
                bool_V=block_condition.get(i+1).bool;
            }
            arrayOfNewLines.push({line:i+1,text:newLine,bool:bool_V});
        }
    }
    return arrayOfNewLines;
}
function replaceVals(line,localDic){
    let newLine='';
    let paramArray= getParamsNameArray();
    if(line.includes('=')){
        newLine=replacrIfContains(line,localDic,paramArray);
    }
    else{
        newLine= replaceIfNotContains(line,localDic,paramArray);
    }
    return newLine;
}
function replacrIfContains(line,localDic,paramArray){
    let idx=line.indexOf('=');
    for (const key of localDic.keys()){
        if(line.includes(key) && line.indexOf(key)>idx &&!arrayContains(key,paramArray)){
            line=line.replace(key,localDic.get(key));
        }
    }
    return line;
}
function replaceIfNotContains(line,localDic,paramArray){
    for (const key of localDic.keys()){
        if(line.includes(key)&& !arrayContains(key,paramArray)){
            line=line.replace(key,localDic.get(key));
        }
    }
    return line;
}
function arrayContains(key,arr){
    for(let i=0;i<arr.length;i++)
    {
        if(arr[i]==key){
            return true;
        }
    }
    return false;
}
function merge_condition_with_brothers(){
    let brothersWithCons = new Map();
    for (const key of block_brothers.keys()){
        let brothersList=block_brothers.get(key);
        let brothers_dic=new Map();
        for(let i=0;i<brothersList.length;i++){
            brothers_dic.set(brothersList[i],block_condition.get(brothersList[i]));
        }
        brothersWithCons.set(key,brothers_dic);
    }
    return brothersWithCons;

}
function create_blocks_info3(i,brothersList,blocks_info_map,key){
    let curr_idx= getBlockIdx(brothersList[i]);
    if(blocks[curr_idx].blockType=='if statement' || blocks[curr_idx].blockType=='else-if statement')
    {
        let bro_idx=getBlockIdx(brothersList[i+1]);
        if(blocks[bro_idx].blockType=='else statement' || blocks[bro_idx].blockType=='else-if statement'){
            let familyObj={parent:key,nextBro:brothersList[i+1]};
            blocks_info_map.set(brothersList[i],familyObj);
        }
        else{
            let familyObj={parent:key,nextBro:null};
            blocks_info_map.set(brothersList[i],familyObj);
        }
    }
    else{
        let familyObj={parent:key,nextBro:null};
        blocks_info_map.set(brothersList[i],familyObj);
    }
    return blocks_info_map;
}
function create_blocks_info2(i,brothersList,blocks_info_map,key){
    if(i+1<brothersList.length){
        blocks_info_map = create_blocks_info3(i,brothersList,blocks_info_map,key);
        return blocks_info_map;
    }
    else{
        let familyObj={parent:key,nextBro:null};
        blocks_info_map.set(brothersList[i],familyObj);
        return blocks_info_map;
    }
}
function create_blocks_info(){
    let blocks_info_map = new Map();
    for (const key of block_brothers.keys()){
        let brothersList = block_brothers.get(key);
        for(let i=0;i<brothersList.length;i++){
            if(i+1<brothersList.length) {
                blocks_info_map = create_blocks_info2(i, brothersList, blocks_info_map, key);
            }
            else{
                let familyObj={parent:key,nextBro:null};
                blocks_info_map.set(brothersList[i],familyObj);
            }
        }
    }
    return blocks_info_map;
}
function extracted1(i,brothersList) {
    let bro_idx = getBlockIdx(brothersList[i+1])
    if(blocks[bro_idx].blockType != 'else-if statement' &&blocks[bro_idx].blockType != 'else statement' ){
        return get_block_end(brothersList[i]);
    }
    let j = i + 1;
    let idx = getBlockIdx(brothersList[j])
    let bool = true;
    while(bool){
        if(blocks[idx].blockType == 'else-if statement'){
            j++;
            idx = getBlockIdx(brothersList[j]);
        }
        else{
            return get_block_end(brothersList[j]);
        }
    }


}
function extracted2(i, brothersList, end_of_last_bro_dic) {
    if (i != brothersList.length - 1) {
        let curr_node = brothersList[i];
        let idx_in_blocks=getBlockIdx(curr_node)
        if (blocks[idx_in_blocks].blockType == 'if statement' || blocks[idx_in_blocks].blockType == 'else-if statement') {
            let last_brother_end = extracted1(i,brothersList);
            end_of_last_bro_dic.set(curr_node, last_brother_end);
        } else {
            let last_brother_end = get_block_end(curr_node);
            end_of_last_bro_dic.set(curr_node, last_brother_end);
        }
    } else {
        let last_brother_end = get_block_end(brothersList[i]);
        end_of_last_bro_dic.set(brothersList[i], last_brother_end);
    }
    return end_of_last_bro_dic;
}
function create_lastBroDic(){
    let end_of_last_bro_dic=new Map();
    for (const key of block_brothers.keys()) {
        if (key == func_declaration_line) {
            end_of_last_bro_dic.set(key, nodes_after_parse[nodes_after_parse.length - 1].Line);
        }
        let brothersList = block_brothers.get(key);
        for (let i = 0; i < brothersList.length; i++) {
            end_of_last_bro_dic= extracted2(i, brothersList, end_of_last_bro_dic);
        }
    }
    return end_of_last_bro_dic;
}
function get_block_end(line_start){
    for(let i=0;i<blocks.length;i++){
        if(blocks[i].start==line_start){
            return blocks[i].end;
        }
    }
}
function getBlockIdx(line_num){
    for(let i=0;i<blocks.length;i++){
        if(blocks[i].start==line_num){
            return i;
        }
    }
}
function get_blocks(){
    return blocks;
}
function get_node_array(){
    return nodes_after_parse;
}
function get_line_of_func_dec(){
    return func_declaration_line;
}
function get_line_numbers(){
    return line_numbers;
}
function get_block_condition(){
    return block_condition;
}
function get_block_brothers(){
    return block_brothers;
}
//*******************************************************************************************************

