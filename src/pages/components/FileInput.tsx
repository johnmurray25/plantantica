import React, { FC, useState } from 'react';

interface Props {
    onAttachFile;
    onRemoveFile;
    message: string;
}

const FileInput: FC<Props> = (props) => {
    const [fileName, setFileName] = useState(null);

    return (
        <div className='flex text-center justify-center h-12 m-auto '>
            {fileName ?
                <div className="p-3 ml-3 border border-yellow rounded">
                    {fileName}
                    <a
                        className='cursor-pointer ml-5 mr-2'
                        onClick={() => {
                            props.onRemoveFile();
                            setFileName(null);
                        }}>
                        &#10060;
                    </a>
                </div>
                :
                <label className="custom-file-upload p-3 cursor-pointer ">
                    <input type="file"
                        onChange={(e) => {
                            props.onAttachFile(e);
                            setFileName(e.target.files[0].name);
                        }}
                        className='hidden' />
                    {props.message}
                </label>
            }
        </div>
    );

}

export default FileInput;
