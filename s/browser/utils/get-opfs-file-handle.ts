
export async function getOpfsFileHandle(
		directory: FileSystemDirectoryHandle,
		name: string,
	) {

	try {
		return await directory.getFileHandle(name)
	}
	catch (error) {
		if (error instanceof Error && error.name === "NotFoundError")
			return undefined
		throw error
	}
}

