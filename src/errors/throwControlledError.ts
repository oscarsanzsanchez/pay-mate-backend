import { Boom } from "@hapi/boom";

type ControlledErrorParams = {
	statusCode: number;
	message: string;
};

export const throwControlledError = (props: ControlledErrorParams) => {
	throw new Boom(props.message, {
		statusCode: props.statusCode
	});
};
