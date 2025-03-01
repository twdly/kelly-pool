import NumberCard from "./NumberCard";
import './NumberCardGrid.css'

interface NumberCardGridProps {
    numbers: number[],
    selectedNumbers: number[],
    handleNumberSelected: Function,
}

function NumberCardGrid({numbers, selectedNumbers, handleNumberSelected}: NumberCardGridProps) {
    const getBorderClass = (num: number) => {
        return selectedNumbers.indexOf(num) === -1 ? "not-selected" : "selected";
    }
    
    const updateSelections = (num: number, isSelectedCurrently: boolean) => {
        if (isSelectedCurrently) {
            handleNumberSelected(selectedNumbers.filter(n => n != num));
        } else {
            handleNumberSelected([...selectedNumbers, num])
        }
    }
    
    return (
        <div className={"number-grid"}>
            {numbers.map(n => {
                return (
                    <div className={`number-grid-item ${getBorderClass(n)}`} key={n} onClick={() => updateSelections(n, selectedNumbers.indexOf(n) !== -1)}>
                        <NumberCard ballNumber={n} />
                    </div>
                )
            })}
        </div>
    )
}

export default NumberCardGrid;