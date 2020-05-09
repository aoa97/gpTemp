import React from "react";
export default function bubbleFunction() {
    const [selected, setSelected] = React.useState(new Map());
    const onSelect = React.useCallback(
        id => {
            const newSelected = new Map(selected);
            newSelected.set(id, !selected.get(id)); 

            setSelected(newSelected);
        },
        [selected],
    );
}


