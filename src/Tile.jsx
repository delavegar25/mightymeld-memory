export function Tile({ content: Content, flip, state }) {
  
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-12 w-12 bg-indigo-300 text-center rounded-md"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="inline-block h-12 w-12 bg-green-500">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched 
        className="inline-block h-12 w-12 text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}


function Back({ className, flip }) {
  return (
    <div onClick={flip} className={ `${className} transform transition-transform ease-in-out duration-500 ${flip ? 'rotate-y-180' : ''} `}>      
    </div>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>; 
}

