//budget controller
var budgetController=(function(){
            // Here im initilizing Expence and Income private functions to reuse
            // this functions anywhere in the program 
            var Expence=function(id,description,value){
                this.id=id;
                this.description=description;
                this.value=value;
                this.percentage=-1;
            };

            Expence.prototype.calcPercentage=function(totalIncome){
                if(totalIncome>0){    
                     this.percentage=Math.round((this.value/totalIncome)*100);
                }
                else{
                    this.percentage=-1;
                }
            
            };
            Expence.prototype.getPercentage=function(){
                      return this.percentage;
            };
            var Income=function(id,description,value){
                this.id=id;
                this.description=description;
                this.value=value;
            };
           var calculateTotal=function(type){
                var sum=0;
                data.allItems[type].forEach(function(cur){
                     sum=sum+cur.value;
                });
                data.totals[type]=sum;
           };
            var data={
                allItems:{
                    exp:[],
                    inc:[]
                },
                totals:{
                    exp:0,
                    inc:0
                },
                budget:0,
                percentage:-1
            }

            return {
                addItem: function(type,des,val){
                var newItem,ID;
               
                // [1,2,3,4,5] next id =6
                //[1,3,5,6,8] next id =9
                //last array[length-1]+1
                 //create new id 
                let length=data.allItems[type].length;
                
                if(length===0)
                {
                    ID=0;
                }
                else
                {
                    ID=data.allItems[type][length-1].id+1;
                    
                }
                if(type=='exp')
                {
                    newItem=new Expence(ID,des,val);
                }
                else if(type==='inc')
                {
                    newItem=new Income(ID,des,val);
                }
                data.allItems[type].push(newItem);
                //return the new element

                return newItem;
                },


                calculateBudget:function(){

                    // calculate total income and expenses
                    calculateTotal('exp');
                    calculateTotal('inc');

                    // calculate budget inc -exp
                    
                    data.budget= data.totals.inc - data.totals.exp;
                   // calculate percentage
                    if(data.totals.inc>0){
                         data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
                        
                    }
                    else{
                        data.percentage=-1;
                    }
                   
                },
                calculatePercentages:function(){
                    data.allItems.exp.forEach(function(current){
                        current.calcPercentage(data.totals.inc);
                    })
                   },
                getPercentages:function(){
                       var allPerc=data.allItems.exp.map(function(cur){
                           return cur.getPercentage();
                       })
                       return allPerc;
                   },
                deleteItem:function (type,id){
                   var ids,index;
                   ids=data.allItems[type].map(function (current){
                       return current.id;
                   });

                   index=ids.indexOf(id);

                   if(index!==-1){
                       data.allItems[type].splice(index,1);
                   }

                },
                testing: function(){
                    return [data.allItems['inc'],data.allItems['exp']];
                },
               
                getBudget:function(){
                    return {
                        budget:data.budget,
                        totalInc:data.totals.inc,
                        totalExp:data.totals.exp,
                        percentage:data.percentage
                    };
                },
                getAllIItems: function (){
                    return data.allItems;
                }
                ,
                get:function () 
                { 
                    return data
                }

            }
})();


//UI controller
var UIController =(function(){
     
            // this is a private variable
            var Domstrings={
                intputType:".add__type",
                inputDescrption:".add__description",
                inputValue:".add__value",
                inputBtn:".add__btn",
                incomeContainer:'.income__list',
                expenceContainer:'.expenses__list',
                budgetLabel:'.budget__value',
                incomeLabel:'.budget__income--value',
                expenseLabel:'.budget__expenses--value',
                percentageLabel:'.budget__expenses--percentage',
                container:'.container',
                expencepercentageLable:'.item__percentage'
                ,dateLabel:'.budget__title--month'
            }
            var formatNumber=function(num,type){
                var numSplit,int,dec;
                num=Math.abs(num);
                num=num.toFixed(2);
                numSplit=num.split('.')
                int=numSplit[0];
                     if(int.length>3){
                         //input 23518 ,op 23,518
                         int.substring(0,int.length-1)+','+int.substring(int.length-3,3);
                     }
                     

                dec=numSplit[1];
                  return (type==='exp'?'-':'+')+' '+int+'.'+dec;
                  

            }

            // public functions
            return {
                getInput: function(){
                    return {
                    type: document.querySelector(Domstrings.intputType).value,
                    description: document.querySelector(Domstrings.inputDescrption).value,
                    value: parseInt(document.querySelector(Domstrings.inputValue).value)
                   }
                },
                
                addListItem:function(obj,type){
                         var html,element,newHtml;
                         //For income html
                        if(type==='inc'){
                            element=Domstrings.incomeContainer;
                            
                            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%  </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button></div> </div></div>';
                        }
                        else if (type==='exp'){
                        // For Expense Html
                            element=Domstrings.expenceContainer;
                           
                            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' 
                        }
                        //replace tje placeholder text  with some actual data
                        newHtml=html.replace('%id%',obj.id);
                        newHtml=newHtml.replace('%description%',obj.description);
                        newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
                        
                        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
                          
                    },
                     deleteListItem:function (selectorId){
                            var ele=document.getElementById(selectorId);
                            ele.parentNode.removeChild(ele);   
                     },
                    clearFeilds:function(){
                        var feilds,feildsArr;
                        
                        feilds=document.querySelectorAll(Domstrings.inputDescrption+','+Domstrings.inputValue);
                        feildsArr=Array.prototype.slice.call(feilds);
                        
                        feildsArr.forEach(function(current,index,array){
                            current.value='';
                        })

                        feildsArr[0].focus();
                    },
                    displayBudget:function(obj){
                        var type;
                        obj.budget>0?type='inc':type='exp';
                       document.querySelector(Domstrings.budgetLabel).innerText=formatNumber(obj.budget,type);
                       document.querySelector(Domstrings.incomeLabel).innerText=formatNumber(obj.totalInc,'inc');
                       document.querySelector(Domstrings.expenseLabel).innerText=formatNumber(obj.totalExp,'exp');
                       if(obj.percentage>0)
                       {
                          document.querySelector(Domstrings.percentageLabel).innerText=obj.percentage+'%';
                       }
                       else{
                       document.querySelector(Domstrings.percentageLabel).innerText='----';
                       }
                    },
                    displayPercentages: function(percentages){
                           var fields=document.querySelectorAll(Domstrings.expencepercentageLable);
                           var nodeListForEach=function(list,callback){
                                  for(var i=0; i<list.length; i++){
                                      callback(list[i],i);
                                  }
                           }
                          nodeListForEach(fields,function(current,index){
                                 if(percentages[index]>0){
                                  current.textContent=percentages[index]+'%';

                                 }
                                 else{
                                  current.textContent='--';
                                     
                                 }
                          }) 
                    },
                    
                
                displayMonth:function(){
                    var now,months,year,month;
                      now=new Date();
                      months=['January','February','March','April','May','June','July','August','September','October','November','December'];
                      month=now.getMonth();
                      year=now.getFullYear();
                      document.querySelector(Domstrings.dateLabel).innerText=months[month]+' '+year;

                },
                getDOMstrings:function(){
                    return Domstrings;
                }

            };
})();



//Global controller
var controller=(function(budgetCntrl,UIcntrl)
{ 
       //  getDOMstrings() is taking from uiController funtion
      
      // we are taling class attributes 

      setupEventListeners=function(){
                   //  if click button means we will get the data like a object
           var DOM=UIcntrl.getDOMstrings();
           document.querySelector(DOM.inputBtn).addEventListener('click',cntrlAddItem);
  
            // if click enter in keyboard it do's samething here
  
            document.addEventListener('keypress',function(event){
  
            if( event.which===13)
            {
                cntrlAddItem();
            }
           });
           document.querySelector(DOM.container).addEventListener('click',cntrlDeleteItem);

      };
      cntrlAddItem=function(){
          var input,newItem;
          
          // we are taking getinput() function from UIController
          // 1.get feild input data 

          input=UIController.getInput();
          if(input.description!=="" && !isNaN(input.value) && input.value>0){
                   //2. ad the item to the budget controller
                        newItem=budgetController.addItem(input.type,input.description,input.value);

                    // 3 ading new item to UI 
                        UIcntrl.addListItem(newItem,input.type);
                        
                    
                    //4 clearing the input feilds
                        UIcntrl.clearFeilds();  
                        
                    // 5 Update Budget 
                   
                    updateBudget();

                    // 4 update Percentages
                    
                    updatePercentage();

          }      

        }
        var cntrlDeleteItem=function(event){
            var itemId,type,ID,splitId;
            itemId =event.target.parentNode.parentNode.parentNode.parentNode.id;
            splitId = itemId.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]);

            //delete item from datastrucature
                budgetCntrl.deleteItem(type,ID)
            //delete the item from UI elements
                 UIcntrl.deleteListItem(itemId);

            //update and show the Budget
                  updateBudget();

            // update percentage 
              updatePercentage();
                   

             
        }
     
        var updateBudget = function(){
            
            // 1. Calculate the budget
             budgetCntrl.calculateBudget();
            
            //2 return the budget
             var budget=budgetCntrl.getBudget();
            
            //3 display the budget on the UI
            budgetCntrl.getAllIItems();
            UIcntrl.displayBudget(budget);
            console.log(budget)
        }
       
        var updatePercentage=function(){
                   //  calcualte Percentages
               
            budgetCntrl.calculatePercentages();
            // Read percentages from the budget uiController
            var percentages=budgetCntrl.getPercentages();

            //update the UI with the new percentages
            UIcntrl.displayPercentages(percentages);
        }
        

        return {
            init:function(){

                console.log('Application Has Started');
                UIcntrl.displayBudget( {
                    budget:budgetCntrl.getBudget().budget,
                    totalInc:budgetCntrl.getBudget().totalInc,
                    totalExp:budgetCntrl.getBudget().totalExp,
                    percentage:budgetCntrl.getBudget().percentage
                })
                UIcntrl.displayMonth();

                setupEventListeners();
                
            }
        }
    

})(budgetController,UIController);

controller.init();

