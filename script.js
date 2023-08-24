let buttons = new Array();
let id_prefix = "tile-";
let chanceX = true;
let isEmptybox = true
let userName;
let receiverName;
let stomp = null;
let submitButton = document.getElementById("submit-button");

document.addEventListener("DOMContentLoaded", function () {
    
    loadTheButtons();
    addEventListenerToAllButtons();
    
    
});
function connect()
{
    const socket = new SockJS("https://tic-toe123.azurewebsites.net/game");

    // const socket = new SockJS("http://localhost:8080/game");
    stomp = Stomp.over(socket);
    stomp.connect({},function(frame)
    {
        console.log("connected");
        stomp.subscribe("/gameRoom/public",function(frame)
        {   
            
            message = JSON.parse(frame.body);
            
            let symbol = message.messageContent;
            let blockId = message.bodyId;
            
            updateMark(blockId,symbol);
            
        });

        // private
        stomp.subscribe("/user/" + userName+ "/game/private",function(frame)
        {
            
            let message = JSON.parse(frame.body);
            let symbol = message.messageContent;
            let blockId = message.bodyId;
            updateMark(blockId,symbol);
            
        });
    });
}

function sendMessage(symbol,id)
{
    let movesOb = 
    {
        sender: userName,
        receiver:receiverName,
        bodyId:id,
        messageContent: symbol

    }
    stomp.send("/app/privateMove",{},JSON.stringify(movesOb));
}
function updateMark(index, mark) {
    
    const tileDiv = buttons[index].querySelector("div");
    
    tileDiv.textContent = mark;
    chanceX = !chanceX;
    this.isEmptybox = false;
     // Update the text content
     
}



function addEventListenerToAllButtons()
{

        buttons.forEach((button,index)=>
        {
            button.isEmptybox = true;
            button.addEventListener("click",function()
            {
                    if(this.isEmptybox)
                    {

                    
                    let symbol = "O";
                    if(chanceX){
                        updateMark(index,'X');
                        symbol = "X"
                    }
                    else
                    {
                        updateMark(index,'O');
                    }
                    // send the changes into server using socket connection
                    
                    sendMessage(symbol,index);
                    
                }
            });
            button.addEventListener("mouseenter",function()
            {
     
                
                if(this.isEmptybox)
                {
     
                    
                    if(chanceX){
                        
                        const tileDiv = buttons[index].querySelector("div");
    
                        tileDiv.textContent = 'X'; // Update the text content
                        
                    }
                    else
                    {
                        const tileDiv = buttons[index].querySelector("div");
    
                        tileDiv.textContent = 'O'; // Update the text content


                    }
                    
                }
                    
            });
            button.addEventListener("mouseleave",function()
            {
                
                 if(this.isEmptybox)
                 {

                  
                             
                        const tileDiv = buttons[index].querySelector("div");
    
                        tileDiv.textContent = ''; // Update the text content
                 }
                     
                        
                    
            });
        })
        submitButton.addEventListener("click",function ()
        {
            
            userName = document.getElementById("user-name").value;
            receiverName = document.getElementById("opp-name").value;
            console.log(userName);
            console.log(receiverName);
            connect();
        });      
    
}
function loadTheButtons()
{
    for(let i = 0;i<9;i++)
    {
        buttons.push(document.getElementById(id_prefix + i));
    }
}



