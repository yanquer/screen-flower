import {Button} from "@radix-ui/themes";

export interface IButtonProps {
    name: string;
    clickEvent: () => void;
}


export const FormButton = (props: IButtonProps) => {
    const {name, clickEvent} = props;
    return <Button size={'1'} color={'bronze'}
                   className={'mr-1'}
                   onClick={() => clickEvent()}
    >{name}</Button>
}

