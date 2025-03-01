import "./NumberCard.css"

interface NumberCardProps {
    ballNumber: number,
}

function NumberCard({ballNumber}: NumberCardProps) {
    const cssClass = (ballNumber: number) => {
        switch (ballNumber) {
            case 1:
                return "yellow";
            case 2:
                return "blue";
            case 3:
                return "red";
            case 4:
                return "purple";
            case 5:
                return "orange";
            case 6:
                return "green";
            case 7:
                return "brown";
            case 8:
                return "black";
            case 9:
                return "yellow-striped";
            case 10:
                return "blue-striped";
            case 11:
                return "red-striped";
            case 12:
                return "purple-striped";
            case 13:
                return "orange-striped";
            case 14:
                return "green-striped";
            case 15:
                return "brown-striped";
            default: 
                return "white";
        }    
    }
    
    return (
        <div className={`${cssClass(ballNumber)} pool-ball`}>
            <p className={"ball-number-text"}>{ballNumber === 16 ? "" : ballNumber}</p>
        </div>
    );
}

export default NumberCard;