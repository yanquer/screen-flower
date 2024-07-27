
interface BgViewProps{
    className?: string
    mode?: 'cap' | 'none'
}
export const DefaultBgView = (props: BgViewProps) => {

    const renderCap = () => {
        return <div
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                // backgroundColor: '#0c0c0e',
            }}
            className={`w-full h-full overflow-hidden ${props.className || ""} `}
        />
    }


    const renderU = () => {
        return <div
            className={`w-full h-full overflow-hidden bg-gray-500 opacity-100 ${props.className || ""} `}
        />
    }

    const render = () => {
        return props.mode === 'cap' ? renderCap() : renderU()
    }

    return render()
}
