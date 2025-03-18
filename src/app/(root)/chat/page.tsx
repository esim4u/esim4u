import React from "react";

type Props = {};

const ChatPage = (props: Props) => {
	return (
		<div className="w-screen h-dvh">
			<iframe
				className="w-full h-full"
				src="https://jivo.chat/TROIdShs2z"
			></iframe>
		</div>
	);
};

export default ChatPage;
