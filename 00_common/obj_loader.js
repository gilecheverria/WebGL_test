// Extract the elements in a face as encoded in an OBJ file
// As faces are read, pass the information into the array that will be used
// to draw the object in WebGL
function parseFace(parts, objData, arrays) {
    let faceVerts = parts.slice(1).map(face => face.split('/'));
    faceVerts.forEach(vert => {
        const vertex = vert != '' ? Number(vert) : undefined
        if (vertex != undefined) {
            // console.log(objData.vertices[vert[0]])

            // First element is the vertex index
            arrays.a_position.data.push(...objData.vertices[vert[0]]);
            // Second element is the texture index
            if (vert.length > 1 && vert[1] != "") {
                arrays.a_texCoord.data.push(...objData.textures[vert[1]]);
            }
            // Third element is the normal index
            if (vert.length > 2 && vert[2] != "") {
                arrays.a_normal.data.push(...objData.normals[vert[2]]);
            }
            // Force a color for each vertex
            arrays.a_color.data.push(0.4, 0.4, 0.4, 1);
            // This is not really necessary, but just in case
            objData.faces.push({v: vert[0], t: vert[1], n: vert[2]});
        }  
    });
}

function loadObj(objString) {

    // Initialize a dummy item in the lists as index 0
    // This will make it easier to handle indices starting at 1 as used by OBJ
    let objData = {
        vertices: [ [0, 0, 0] ],
        normals: [ [0, 0, 0] ],
        textures: [ [0, 0, 0] ],
        faces: [ ],
    };

    // The array with the attributes that will be passed to WebGL
    let arrays = {
        a_position: {
            numComponents: 3,
            data: [ ]
        },
        a_color: {
            numComponents: 4,
            data: [ ]
        },
        a_normal: {
            numComponents: 3,
            data: [ ]
        },
        a_texCoord: {
            numComponents: 2,
            data: [ ]
        }
    };

    let partInfo;
    let lines = objString.split('\n');
    lines.forEach(line => {
        let parts = line.split(/\s+/);
        switch (parts[0]) {
            case 'v':
                partInfo = parts.slice(1).filter(v => v != '').map(Number);
                objData.vertices.push(partInfo);
                break;
            case 'vn':
                partInfo = parts.slice(1).filter(vn => vn != '').map(Number);
                objData.normals.push(partInfo);
                break;
            case 'vt':
                partInfo = parts.slice(1).filter(f => f != '').map(Number);
                objData.textures.push(partInfo);
                break;
            case 'f':
                parseFace(parts, objData, arrays);
                break;
        }
    });

    //console.log("ATTRIBUTES:")
    //console.log(arrays);

    //console.log("OBJ DATA:")
    //console.log(objData);

    return arrays;
}

export { loadObj }
