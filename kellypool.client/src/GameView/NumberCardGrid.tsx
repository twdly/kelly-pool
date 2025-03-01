import NumberCard from "./NumberCard";
import './NumberCardGrid.css'

interface NumberCardGridProps {
    numbers: number[],
    selectedNumbers: number[],
}

function NumberCardGrid({numbers, selectedNumbers}: NumberCardGridProps) {
    const getBorderClass = (num: number) => {
        return selectedNumbers.indexOf(num) === -1 ? "not-selected" : "selected";
    }
    
    return (
        <div className={"number-grid"}>
            {numbers.map(n => {
                return (
                    <div className={`number-grid-item ${getBorderClass(n)}`} key={n}>
                        <NumberCard ballNumber={n} />
                    </div>
                )
            })}
        </div>
    )
}

export default NumberCardGrid;