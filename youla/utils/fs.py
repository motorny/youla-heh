import base64
import imghdr
import os
import uuid

from flask import current_app as app


def save_file(path, data):
    decoded = base64.decodebytes(data.encode())
    ext = imghdr.what("", h=decoded)
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], path, filename)

    with open(filepath, "wb") as fh:
        fh.write(decoded)
    app.logger.debug("Saved to: {}".format(filepath))
    return os.path.join(path, filename)
