import { FileUploader } from "@carbon/react"
// import { FormatBytes } from "../../helper/number";
import { useState } from "react";
import { FormatBytes } from "../../helper/number";


interface ListFileTestParam {
  file: File
}

const ListFileTest : React.FC<ListFileTestParam> = ({file}: ListFileTestParam) => {
  return (
    <div>
      <p>FileType: {file.type}</p>
      <p>Name: {file.name}</p>
      <p>Size: {FormatBytes(file.size)}</p>
    </div>
  )
}

const FilesUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    return (
      <>
        <div style={{marginBottom: '1rem'}}>
          <FileUploader
            accept={[
              '.jpg',
              '.png'
            ]}
            buttonKind="primary"
            buttonLabel="Add file"
            filenameStatus="edit"
            iconDescription="Delete file"
            // labelDescription="Max file size is 1 MB. Only .jpg files are supported."
            labelTitle="Upload files"
            // maxFileSize={1048576} 
            // multiple
            name="fileupload"
            onAddFiles={(_, content) => {
              content.addedFiles.forEach((value) => {
                setUploadedFiles([value])
              })
            }}
            onDelete={() => {
              setUploadedFiles([])
            }}
            size="md"
            disabled={ uploadedFiles.length !== 0 }
          />
        </div>
        <div>
          {uploadedFiles.map((value, index) => (
            <ListFileTest key={index} file={value} />
          ))}
        </div>
      </>
    )
}

export default FilesUpload