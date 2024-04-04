/**
 * <div id = "parent">
 * <div id = "child"
 * <h1>im at h1 tag
 * <h2>im at h2 tag
 * <div id "child2"
 * <h1> im at at h1 tag
 * <h2> im at h2 tag
 * 
 * 
 * 
 * 
 * 
 */



const parent = React.createElement("div",{id:"parent"},[
    React.createElement("div",{id : "child"},[
        React.createElement("h1",{},"Im at h1 tag"),
        React.createElement("h2",{},"Im at h2 tag")
    ]),
    React.createElement("div",{id:"child2"},[
        React.createElement("h1",{},"Im at h2 tag"),
        React.createElement("h2",{},"Im at h2 tag")
    ]),
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(parent)

    

