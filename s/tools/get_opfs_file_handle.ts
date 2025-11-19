
export async function get_opfs_file_handle(
		directory: FileSystemDirectoryHandle,
		name: string,
	) {

	try {
		return directory.getFileHandle(name)
	}
	catch (error) {
		if (error instanceof Error && error.name === "NotFoundError")
			return undefined
		throw error
	}
}

