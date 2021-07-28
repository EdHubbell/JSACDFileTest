// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// CONVERTED TO JSCAD by z3dev
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Title:        Parametric Caged Bearing
// Version:      3.7
// Release Date: 2019-12-14 (ISO 8601)
// Author:       Rohin Gosling
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
//
// Description:
//
// - Parametric butt hinge, designed to be printed in one step.
//
// - While the entire working hinge may be printed in one step, it is also possible to disabled the internal fused pin, and leave a shaft
//   which may be used in the case where an external pin is desired.
//
// Release Notes:
//
// - Version 3.7
//   * Added a comment for the "knuckle_count" parameter, to notify users to always set an odd knuckle count in order to ensure that the unified
//     pin is supported by male knuckles on both ends. An even number of knuckles will leave one end of the unified pin unsupported by a male knuckle.
//   * Added a constraint to the "knuckle_count" parameter, to force an odd knuckle count. Even knuckle counts are now incemented to next odd number.
//     Example:
//     - A knuckle count of 4, will be incremented to 5.
//     - A knuckle count of 10 will, with be incremented to 11
//
// - Version 3.6
//   * Removed extended ASCII characters to make the source code compatible with the UTF-8 encoding required by the Thingiverse Customizer.
//
// - Version 3.5
//   * For hexagonal counterbores, the hexagonal cut has been rotated 90 degrees, to reduce the need for support material.
//     The overhang angle for hexagonal counterbore is 60 degrees.
//
// - Version 3.4
//   * Added support for linear and parabolic gusset curves.
//   * Factored out all SCG (Solid Constructive Geometry) overlap constants, and consolidated them into one global constant, "SCG_OVERLAP".
//
// - Version 3.3
//   * Placed pin shaft parameters into their own parameter group in the Thingiverse Customizer.
//
// - Version 3.2
//   * Added support for independently configurable top and bottom pin shaft counterbores.
//   * Added an assembly option to flip the model about the z-axis.
//     Usefull for viewing the top and bottom pin shaft counterbores.
//   * Configured the hinge throw angle Thingiverse Customizer parameter step size, to 5 degrees.
//
// - Version 3.1
//   * Added a counterbore feature for the pin shaft.
//     - While this feature may be enabled for one piece hinges that have the fused pin enabled, it is primarily designed for use with two
//       piece configurations that have their pin disabled. For instance, when the hinge is to be assembled using an external pin.
//     - In the case where a hinge is to be assembled using an external pin, it may be desired to have a pin shaft counterbore, where the end
//       caps of the knuckle joint array are counterbored, in order to allow the pin or bolt heads of the pin shaft, to be set flush with the
//       top and bottom edges of the hinge leaves.
//     - To accommodate both hexagonal and square bolt heads and nuts, the counterbore may be set to any one of circular, square or hexagonal.
//   * Added private text feature.
//     - A public parameter for the Thingiverse Customizer has not been added yet, however, users may set the 'text_enabled' local variable
//       in the 'leaf' module to 'true', which will enable a single row of inscribed text on each leaf.
//     - By default this feature will only work when exactly 4 fastener holes have been selected via the 'fastener_count' parameter, simply
//       because there is a nice open space available between the fastener holes for placing text, when 4 fastener holes are chosen.
//     - Text for the male and female leaves may be specified independently.
//
// - Version 3.0
//   * Added a parameter to disable the hinge pin, for when users would like to assemble with an external pin.
//   * Changed the main Thingiverse Customizer parameter group name from "Hinge Options", to "Assembly Options".
//   * Added a parameter to set the hinge throw angle.
//     Users can now set the throw angle, either for analysis and visualisation purposes, or for when the hinge is to be printed vertically
//     standing up on edge, in which case a throw angle of 120 degrees may be used to help keep the hinge stable on the build plate.
//   * Corrected spelling errors in the comments.
//
// - Version 2.9
//   * Added support for parabolic knuckle gussets to strengthen the knuckle joints.
//     Knuckle gussets may now be toggled on and off with the 'enable_knuckle_gusset' parameter.
//
// - Version 2.8
//   * Added the parameter, 'fastener_column_count', to enable single column fastener arrangements, that can be used for
//     piano hinge style fastener arrangements.
//
// - Version 2.7
//   * Rewrote the knuckle cutter module using mode generic math, that enables more parametizable control over knuckle joint
//     dimensions and configuration.
//
// - Version 2.6
//   * Added support for countersunk fastener holes. Now users can select either counterbore or countersunk.
//     dimensions and configuration.
//   * Started tracking release updates.
//
// - Version 1.0 - 2.5
//   * N/A - Release updates not tracked.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Function: Clip
//
// Description:
//
// - Clips an input value, to a minimum and maximum value.
//
//   x_min <= x <= x_max
//
// Parameters:
//
// - x
//   Input value.
//
// - x_min
//   Minimal value constraint. Any x less than x_min, is set to x_min.
//
// - x_max
//   Maximum value constraint. Any x greater than x_max, is set to x_max.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const clip = (x, x_min, x_max) => (x < x_min) ? x_min : (x > x_max) ? x_max : x

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Constants:
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

// System constants.

const C_CONSTANT = 0 + 0 // Used to hide constant values from Thingiverse. Add to other constants to hide them as well.
const C_NONE = C_CONSTANT + 0

// Leaf gender.

const C_FEMALE = C_CONSTANT + 0
const C_MALE = C_CONSTANT + 1

// SCG constants.

const SCG_OVERLAP = C_CONSTANT + 0.01 // Used for overlapping Boolean operations in order to avoid Boolean edge artefacts.
const C_NEGATIVE = C_CONSTANT + 0 // Used for subtractive Boolean tools.
const C_POSITIVE = C_CONSTANT + 1 // Used for additive Boolean tools.

// Bolt head shapes.

const C_CIRCULAR = C_CONSTANT + 0
const C_SQUARE = C_CONSTANT + 1
const C_HEXAGONAL = C_CONSTANT + 2

// Curve Type

const C_FUNCTION_LINEAR = C_CONSTANT + 1 //  y = ax + b
const C_FUNCTION_CIRCULAR = C_CONSTANT + 2 // r2 = x2 + y2
const C_FUNCTION_PARABOLIC = C_CONSTANT + 3 //  y = a2(x - j)2 + k    ...Vertex form.

// Minimum and maximum constraints.

const C_MIN_HINGE_WIDTH = C_CONSTANT + 1.0
const C_MIN_HINGE_HEIGHT = C_CONSTANT + 1.0
const C_MIN_LEAF_GAUGE = C_CONSTANT + 1.0
const C_MIN_COMPONENT_CLEARENCE = C_CONSTANT + 0.1
const C_MAX_COMPONENT_CLEARENCE = C_CONSTANT + 1.0
const C_MIN_KNUCKLE_COUNT = C_CONSTANT + 3
const C_MAX_KNUCKLE_COUNT = C_CONSTANT + 15
const C_MIN_KNUCKLE_GUSSET_WIDTH = C_CONSTANT + 1.0
const C_MIN_FASTENER_MARGIN = C_CONSTANT + 1.0
const C_MIN_PIN_DIAMETER = C_CONSTANT + 1.0
const C_MIN_COUNTER_SINK_DEPTH_STOP = C_CONSTANT + 1.0
const C_MIN_FASTENER_THREAD_DIAMETER = C_CONSTANT + 0.0
const C_MIN_FASTENER_COUNT = C_CONSTANT + 3
const C_MIN_FASTENER_COLUMN_COUNT = C_CONSTANT + 1
const C_MAX_FASTENER_COLUMN_COUNT = C_CONSTANT + 2
const C_MIN_TESSELLATION = C_CONSTANT + 32
const C_MAX_TESSELLATION = C_CONSTANT + 256
const C_MIN_THROW_ANGLE = C_CONSTANT + -90
const C_MAX_THROW_ANGLE = C_CONSTANT + 180
const C_MIN_PIN_SHAFT_COUNTERBORE_DIAMETER = C_CONSTANT + 0.1
const C_MIN_PIN_SHAFT_COUNTERBORE_WALL_THICKNESS = C_CONSTANT + 0.3
const C_MIN_PIN_SHAFT_COUNTERBORE_DEPTH = C_CONSTANT + 0.0

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Thingiverse Parameters.
//
// - These parameters are used to integrate with the Thingiverse Customizer, and should only be used by the
//   class member variables specified in the "Model parameters" section below.
//
// - These Thingiverse Parameters should never be accessed from inside any module. We do this to enforce
//   principles of object orientation.
//
// - By separating concerns between variables exposed to Thingiverse vs. variables used internally by the
//   SCAD model (class), we are better able to manage the ordering and grouping of variables exposed to
//   Thingiverse, vs. the ordering of variables used internally by the model.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const getParameterDefinitions = () => [
  /* [Assembly Options] */
  { name: 'assemblyooptions', type: 'group', caption: 'Assembly Options' },
  { name: 'm_male_leaf_enabled', type: 'choice', caption: 'Enable male leaf?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_female_leaf_enabled', type: 'choice', caption: 'Enable female leaf?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_leaf_fillet_enabled', type: 'choice', caption: 'Enable fillets?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_pin_enabled', type: 'choice', caption: 'Enable hinge pin?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_pin_auto_size_enabled', type: 'choice', caption: 'Enable custom hinge pin?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_pin_shaft_counterbore_enabled', type: 'choice', caption: 'Enable counterbore for hinge pin?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },
  { name: 'm_fasteners_enabled', type: 'choice', caption: 'Enable holes for fasteners?', values: [0, 1], captions: ['No', 'Yes'], initial: 'Yes' },

  { name: 'leafoptions', type: 'group', caption: 'Leaf Options (2 per hinge)', initial: 'closed' },
  { name: 'm_leaf_width', caption: 'Width:', type: 'float', default: 32.5, min: 6.0, max: 200, step: 0.5 },
  { name: 'm_leaf_height', caption: 'Height:', type: 'float', default: 60.0, min: 6.0, step: 0.5 },
  { name: 'm_leaf_gauge', caption: 'Thickness:', type: 'float', default: 5, min: 3.0, step: 0.5 },
  { name: 'm_knuckle_gusset_type', type: 'choice', caption: 'Gusset type?', values: [0, 1, 2, 3], captions: ['None', 'Linear', 'Circular', 'Parabolic'], initial: 'None' },
  { name: 'm_knuckle_count', type: 'int', caption: 'Number of knuckles:', default: 7, min: C_MIN_KNUCKLE_COUNT, max: C_MAX_KNUCKLE_COUNT, step: 2 },
  { name: 'm_component_clearance', caption: 'Clearance:', type: 'float', default: 0.4, min: 0.1, step: 0.025 },

  { name: 'pinoptions', type: 'group', caption: 'Pin Options', initial: 'closed' },
  { name: 'm_pin_diameter', caption: 'Diameter:', type: 'float', default: 3.0, min: C_MIN_PIN_DIAMETER, step: 0.25 },
  { name: 'm_top_pin_shaft_counterbore_diameter', type: 'float', caption: 'Top Counterbore Diameter:', default: 6.5, min: C_MIN_PIN_SHAFT_COUNTERBORE_DIAMETER, step: 0.25 },
  { name: 'm_top_pin_shaft_counterbore_depth', type: 'float', caption: 'Top Counterbore Depth:', default: 2.5, min: C_MIN_PIN_SHAFT_COUNTERBORE_DEPTH, step: 0.25 },
  { name: 'm_top_pin_shaft_counterbore_shape', type: 'choice', caption: 'Top Counterbore Shape?', values: [0, 1, 2], captions: ['Round', 'Square', 'Hexagon'], initial: 'Round' },
  { name: 'm_bottom_pin_shaft_counterbore_diameter', type: 'float', caption: 'Bottom Counterbore Diameter:', default: 6.5, min: C_MIN_PIN_SHAFT_COUNTERBORE_DIAMETER, step: 0.25 },
  { name: 'm_bottom_pin_shaft_counterbore_depth', type: 'float', caption: 'Bottom Counterbore Depth:', default: 2.5, min: C_MIN_PIN_SHAFT_COUNTERBORE_DEPTH, step: 0.25 },
  { name: 'm_bottom_pin_shaft_counterbore_shape', type: 'choice', caption: 'Bottom Counterbore Shape?', values: [0, 1, 2], captions: ['Round', 'Square', 'Hexagon'], initial: 'Round' },

  { name: 'fasteneroptions', type: 'group', caption: 'Fastener Options', initial: 'closed' },
  { name: 'm_fastener_head_type', type: 'choice', caption: 'Head type?', values: [0, 1], captions: ['Counterbored', 'Countersunk'], initial: 'Counterbored' },
  { name: 'm_fastener_head_diameter', caption: 'Head diameter:', type: 'float', default: 7.0, min: 1.0, max: 200, step: 0.5 },
  { name: 'm_fastener_thread_diameter', caption: 'Thread diameter:', type: 'float', default: 3.5, min: 0.5, max: 200, step: 0.5 },
  { name: 'm_counter_sink_depth', caption: 'Head countersink:', type: 'float', default: 2.5, min: 0, max: 200, step: 0.5 },
  { name: 'm_fastener_column_count', caption: 'Colums:', type: 'int', default: 2, min: 1, max: 2, step: 1 },
  { name: 'm_fastener_count', caption: 'Count:', type: 'int', default: 6, min: 3, max: 36, step: 1 },

  { name: 'viewoptions', type: 'group', caption: 'View Options', initial: 'closed' },
  { name: 'm_throw_angle', type: 'int', caption: 'Throw angle:', default: 0, min: C_MIN_THROW_ANGLE, max: C_MAX_THROW_ANGLE, step: 5 },
  { name: 'm_flip_model', type: 'choice', caption: 'Flip?', values: [0, 1], captions: ['No', 'Yes'], initial: 'No' }
]

/* [Assembly Options] */

const enable_male_leaf = 1 // [ 0:No, 1:Yes ]
const enable_female_leaf = 1 // [ 0:No, 1:Yes ]
const enable_fillet = 1 // [ 0:No, 1:Yes ]
// Turn this off to omit the hinge pin from the female leaf.
const enable_pin = 1 // [ 0:No, 1:Yes ]
// Turn this off to set a custom pin diameter. Auto pin size is equal to the leaf gauge.
const enable_auto_pin_size = 1 // [ 0:No, 1:Yes ]
const enable_pin_shaft_counterbore = 0 // [ 0:No, 1:Yes ]
const enable_fasteners = 1 // [ 0:No, 1:Yes ]
const knuckle_gusset_type = 0 // [ 0:None, 1:Linear, 2:Circular, 3:Parabolic ]
// From +180 degrees fully closed, to -90 degrees fully opened. Default = 0 (ie. Opened flat).
const throw_angle = 0.0 // [ -90 : 5 : 180 ]
// Rotates the model 180 degrees about the z-axis.
const flip_model = 0 // [ 0:No, 1:Yes ]
// Recommended value is 64 or greater.
const resolution = 128
const component_color = 'Silver'

/* [Hinge Parameters] */

const hinge_width = 65.0
const leaf_height = 60.0
// Leaf and knuckle thickness. Values greater than 3mm recommended.
const leaf_gauge = 5.0
// Recomended values between 0.3 and 4.0. Better quality below 3.0, tough to loosen.
const component_clearance = 0.4
// Knuckle count must be an odd number, so that the pin is supported on both ends.
const knuckle_count = 7 // [3:2:31]
// Manual pin diameter setting. Only has effect, if "Enable Auto Pin Size" is set to "No".
const pin_diameter = 3.0

/* [Pin Shaft Parameters] */

const top_pin_shaft_counterbore_diameter = 6.5
const top_pin_shaft_counterbore_depth = 2.5
const top_pin_shaft_counterbore_shape = 0 // [ 0:Circular, 1:Square, 2:Hexagonal ]
const bottom_pin_shaft_counterbore_diameter = 6.0
const bottom_pin_shaft_counterbore_depth = 2.5
const bottom_pin_shaft_counterbore_shape = 2 // [ 0:Circular, 1:Square, 2:Hexagonal ]

/* [Fastener Parameters] */

// For countersunk, the chamfer angle may be adjusted using the other parameters.
const fastener_head_type = 0 // [ 0:Counterbored, 1:Countersunk ]
const counter_sink_depth = 2.5
const fastener_thread_diameter = 3.5
// Add 0.5mm to 1.0mm to the fastener head diameter, to allow for head clearance.
const fastener_head_diameter = 7.0
const fastener_count = 6 // [3:32]
const fastener_column_count = 2 // [1,2]
// Distance from the edge of the head diameter, to the edges of the leaves.
const fastener_margin = 3

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Model parameters and geometric constraints. (Class member variables).
//
// - If we treat an OpenSCAD file as though it is an object oriented class, then we can prefix global variables
//   with "m_", to denote class membership.
//   - As an alternative to "m_", we could also use "this_" as a standard. However, "m_" is shorter and faster to type.
//   - Another advantage of this convention, is that we can arrange parameters meant for display in Thingiverse, in
//     an order that makes sense to the user, while arranging the member versions of the parameters in an order
//     that better accommodates constraint computation.
//
// - Once we have defined global variables as member variables of a class, in this case the class represented
//   by the SCAD file, then we are free to better manage global vs local scope of class member
//   variables, vs. local module (method) variables.
//
// - Thingiverse only integrates constant literal values. So as long as we reference other parameters or
//   initialize variables as expressions, then none of these will appear in the Thingiverse customizer.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const defaults = {

  // Assembly Options.

  m_male_leaf_enabled: (enable_male_leaf === 1),
  m_female_leaf_enabled: (enable_female_leaf === 1),
  m_leaf_fillet_enabled: (enable_fillet === 1),
  m_pin_enabled: (enable_pin === 1),
  m_pin_auto_size_enabled: (enable_auto_pin_size === 1),
  m_pin_shaft_counterbore_enabled: (enable_pin_shaft_counterbore === 1),
  m_fasteners_enabled: (enable_fasteners === 1),
  m_knuckle_gusset_type: knuckle_gusset_type,
  m_flip_model: (flip_model === 1),
  m_throw_angle: clip(throw_angle, C_MIN_THROW_ANGLE, C_MAX_THROW_ANGLE),

  // Leaf Parameters.

  m_leaf_width: hinge_width / 2.0,
  m_leaf_height: (leaf_height <= C_MIN_HINGE_HEIGHT) ? C_MIN_HINGE_HEIGHT : leaf_height,
  m_leaf_gauge: clip(leaf_gauge, C_MIN_LEAF_GAUGE, hinge_width / 2.0 / 2.0),

  // Mechanical Properties.

  m_component_clearance: clip(component_clearance, C_MIN_COMPONENT_CLEARENCE, C_MAX_COMPONENT_CLEARENCE),
  m_knuckle_outer_radius: leaf_gauge * 2.0,
  m_knuckle_count: clip(1 + 2 * Math.floor(knuckle_count / 2), C_MIN_KNUCKLE_COUNT, C_MAX_KNUCKLE_COUNT),
  m_fastener_margin: clip(fastener_margin, C_MIN_FASTENER_MARGIN, (hinge_width / 2.0 - leaf_gauge - fastener_head_diameter) / 2.0),
  m_knuckle_gusset_width: clip(fastener_margin, C_MIN_KNUCKLE_GUSSET_WIDTH, hinge_width / 2.0 - leaf_gauge - component_clearance),

  // Pin Parameters.

  m_pin_diameter: clip(pin_diameter, C_MIN_PIN_DIAMETER, 2.0 * leaf_gauge - C_MIN_PIN_DIAMETER),
  m_parametric_pin_diameter: (enable_auto_pin_size === 1) ? leaf_gauge : pin_diameter,
  m_top_pin_shaft_counterbore_diameter: clip(top_pin_shaft_counterbore_diameter, C_MIN_PIN_SHAFT_COUNTERBORE_DIAMETER, 2.0 * leaf_gauge - C_MIN_PIN_SHAFT_COUNTERBORE_WALL_THICKNESS),
  m_top_pin_shaft_counterbore_depth: clip(top_pin_shaft_counterbore_depth, C_MIN_PIN_SHAFT_COUNTERBORE_DEPTH, 0.66 * (leaf_height / (knuckle_count + component_clearance))),
  m_top_pin_shaft_counterbore_shape: top_pin_shaft_counterbore_shape,
  m_bottom_pin_shaft_counterbore_diameter: clip(bottom_pin_shaft_counterbore_diameter, C_MIN_PIN_SHAFT_COUNTERBORE_DIAMETER, 2.0 * leaf_gauge - C_MIN_PIN_SHAFT_COUNTERBORE_WALL_THICKNESS),
  m_bottom_pin_shaft_counterbore_depth: clip(bottom_pin_shaft_counterbore_depth, C_MIN_PIN_SHAFT_COUNTERBORE_DEPTH, 0.8 * (leaf_height / knuckle_count)),
  m_bottom_pin_shaft_counterbore_shape: bottom_pin_shaft_counterbore_shape,

  // Fastener parameters.

  m_fastener_head_type: fastener_head_type,
  m_counter_sink_depth: clip(counter_sink_depth, 0.0, leaf_gauge - C_MIN_COUNTER_SINK_DEPTH_STOP),
  m_fastener_head_diameter: clip(fastener_head_diameter, fastener_thread_diameter, hinge_width / 2.0 - leaf_gauge - component_clearance - 2.0 * fastener_margin),
  m_fastener_thread_diameter: clip(fastener_thread_diameter, C_MIN_FASTENER_THREAD_DIAMETER, fastener_head_diameter),
  m_fastener_column_count: clip(fastener_column_count, C_MIN_FASTENER_COLUMN_COUNT, C_MAX_FASTENER_COLUMN_COUNT),
  m_fastener_count: clip(fastener_count, C_MIN_FASTENER_COUNT, fastener_column_count * (leaf_height - 2.0 * fastener_margin) / (fastener_head_diameter + component_clearance)),

  m_leaf_fillet_radius: fastener_head_diameter / 2.0 + fastener_margin,

  // Model parameters.

  m_resolution: clip(resolution, C_MIN_TESSELLATION, C_MAX_TESSELLATION),
  m_component_color: component_color
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      Main
// Module Type: Model
//
// Description:
//
// - Program entry point.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const main = (params) => {
  params = Object.assign({}, defaults, params)

  // calculate values for model
  params.m_knuckle_outer_radius = params.m_leaf_gauge * 2.0
  params.m_fastener_margin = clip(fastener_margin, C_MIN_FASTENER_MARGIN, (params.m_leaf_width - params.m_leaf_gauge - fastener_head_diameter) / 2.0)
  params.m_knuckle_gusset_width = clip(fastener_margin, C_MIN_KNUCKLE_GUSSET_WIDTH, params.m_leaf_width - params.m_leaf_gauge - params.m_component_clearance)

  params.m_parametric_pin_diameter = (params.m_pin_auto_size_enabled === 1) ? params.m_pin_diameter : params.m_leaf_gauge

  params.m_leaf_fillet_radius = params.m_fastener_head_diameter / 2.0 + params.m_fastener_margin

  // Initialize model resolution.

  // $fn = m_resolution;

  // Generate hinge assembly.

  const assembly = []
  if (params.m_female_leaf_enabled) assembly.push(rotate([0.0, -params.m_throw_angle, 0.0], leaf(params, C_FEMALE)))
  if (params.m_male_leaf_enabled) assembly.push(leaf(params, C_MALE))
  return rotate([0.0, 0.0, (params.m_flip_model) ? 180.0 : 0.0], assembly)
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      leaf.
// Module Type: Component.
//
// Description:
//
// - Creates a hinge leaf component, whose gender may be selected through the gender argument.
//
// - Note:
//   The text option is not made public to the Thingiverse Customizer at this time.
//   However, you can add and configure text here in the code.
//
// Parameters:
//
// - gender:
//   The gender (male, female), of the leaf. The female leaf holds the pin.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const leaf = (params, gender) => {
  // Text configuration.

  const text_enabled = false
  const text_string_female = '0.4'
  const text_string_male = 'RG'
  const text_female_font_size = 8
  const text_male_font_size = 8

  // Compute the gender angle.
  // - 0 degrees for female, and 180 degrees for male.
  // - In other words, we leave the female leaf un-rotated, but we rotate the male leaf 180 degrees, to place it at an
  //   opposing orientation to the female.

  const gender_angle = (gender === C_FEMALE) ? 0 : 180

  // Create leaves.
  let fastener_set = []
  if (params.m_fasteners_enabled) {
    fastener_set = tool_cutter_fastener_set(params)
  }
  let counterbores = []
  if (params.m_pin_shaft_counterbore_enabled && gender === C_FEMALE) {
    counterbores = tool_cutter_pin_shaft_counterbore(
      params,
      params.m_top_pin_shaft_counterbore_diameter,
      params.m_top_pin_shaft_counterbore_depth,
      params.m_top_pin_shaft_counterbore_shape,
      params.m_bottom_pin_shaft_counterbore_diameter,
      params.m_bottom_pin_shaft_counterbore_depth,
      params.m_bottom_pin_shaft_counterbore_shape
    )
  }

  return rotate([0, 0, gender_angle],
    color(params.m_component_color,
      difference(
        // Cut pin hole.

        workpiece_leaf_knuckle_pin(params, gender),

        // Cut fstener holes.

        fastener_set,

        // Cut pin shaft counterbore into female leaf.

        counterbores

        // Cut text.
        // -  We will only cut text into the leaves, if we are using exactly 4 fasteners per leaf.
        // -  All other leaf counts will not leave enough space for the text to fit easily. So we only add text, if we are using 4 fasteners.

        // TODO if ( text_enabled && params.m_fastener_count == 4 )
        // {
        //    if ( gender == C_FEMALE ) tool_cutter_text ( text_string_female, text_female_font_size );
        //    if ( gender == C_MALE )   tool_cutter_text ( text_string_male,   text_male_font_size );
        // }
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_leaf_knuckle_pin
// Module Type: Workpiece.
//
// Description:
//
// - This module creates the workpiece used to construct either a male or female leaves.
//
// Parameters:
//
// - gender:
//   The gender (male, female), of the leaf. The female leaf holds the pin.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_leaf_knuckle_pin = (params, gender) => {
  // Initialize local variables.

  const d = params.m_parametric_pin_diameter
  const c = params.m_component_clearance
  let e = SCG_OVERLAP

  let dc
  if (params.m_pin_enabled) {
    dc = d - c / 2.0
    e = 0 - e
  } else {
    dc = d + c / 2.0
  }

  // Combine pin with leaf and knuckle.

  if (gender === C_FEMALE) {
    if (params.m_pin_enabled) {
      // Fuse the pin to the female leaf by default.

      return union(
        workpiece_leaf_knuckle(params, C_FEMALE),
        pin(dc, params.m_leaf_height + e)
      )
    } else {
      // Cut a hole for an external pin if selected by the user.

      return difference(
        workpiece_leaf_knuckle(params, C_FEMALE),
        pin(dc, params.m_leaf_height + e)
      )
    }
  } else {
    // Cut a hole for the pin to pass throug in the male leaf.
    dc = d + c / 2.0

    return difference(
      workpiece_leaf_knuckle(params, C_MALE),
      pin(dc, params.m_leaf_height + e)
    )
  }
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      pin
// Module Type: Component.
//
// Description:
//
// - Hinge pin component.
//
// Parameters:
//
// - diameter:
//   Diameter of the cylinder used to create the pin.
//
// - length:
//   Length of the cylinder used to create the pin.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const pin = (diameter, length) => {
  // Initialize pin dimensions.

  const tx = 0
  const ty = 0
  const tz = -length / 2

  // Create pin.

  return rotate([90, 0, 0],
    translate([tx, ty, tz],
      cylinder({ d: diameter, h: length })
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_leaf_knuckle
// Module Type: Workpiece.
//
// Description:
//
// - Workpiece used to cut away knuckle structures.
//
// Parameters:
//
// - gender:
//   The gender (male, female), of the leaf. The female leaf holds the pin.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_leaf_knuckle = (params, gender) => {
  // Initialize local variables.

  const gender_flipped = (gender === C_MALE) ? C_FEMALE : C_MALE

  const w = params.m_leaf_width
  const l = params.m_leaf_height
  const h = params.m_leaf_gauge
  const r = params.m_leaf_fillet_radius
  const d = params.m_knuckle_outer_radius

  let gusset_array_positive = []
  let gusset_array_negative = []
  if (params.m_knuckle_gusset_type !== C_NONE) {
    gusset_array_positive = translate(
      [0, l / 2, 0],
      workpiece_gusset_array(
        params,
        gender,
        params.m_knuckle_gusset_type,
        C_POSITIVE,
        false
      )
    )
    gusset_array_negative = workpiece_gusset_array(
      params,
      gender_flipped,
      params.m_knuckle_gusset_type,
      C_NEGATIVE,
      true
    )
  }
  // Create workpiece.

  return difference(
    difference(
      // leaf and knuckle work piece.

      translate([0, -l / 2, 0],
        union(
          // Leaf.

          workpiece_leaf(params, w, l, h, r),

          // Knuckle.

          rotate([-90, 0, 0], cylinder({ d: d, h: l })),

          // Gusset array.

          gusset_array_positive
        )
      ),

      // Cut knuckle gaps.

      tool_cutter_knuckle_array(
        params,
        gender,
        true,
        2.0 * params.m_leaf_gauge + params.m_component_clearance
      )
    ),

    // Cut opposing gusset groves.

    gusset_array_negative
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_leaf
// Module Type: Workpiece.
//
// Description:
//
// - Workpiece used to cut away leaf structures.
//
// Parameters:
//
// - w:
//   Width of a single leaf.
//
// - l:
//   Length of the leaf.
//
// - h:
//   Height of the leaf.
//
// - r:
//   Radius of the hinge knuckle.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_leaf = (params, w, l, h, r) => {
  let leaf
  if (params.m_leaf_fillet_enabled) {
    // Leaf.

    leaf = union(
      cube({ size: [w - r, l, h] }),
      translate([0, r, 0], cube({ size: [w, l - 2 * r, h] })),

      // Fillet corcers.

      translate([w - r, r, 0], cylinder({ r: r, h: h })),
      translate([w - r, l - r, 0], cylinder({ r: r, h: h }))
    )
  } else {
    // Leaf.

    leaf = cube({ size: [w, l, h] })
  }
  return translate([0, 0, -h], leaf)
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_gusset_array
// Module Type: Workpiece.
//
// Description:
//
// - Create an array of cutting blocks. Mostly used to cut gusset workpiece into individual gusset positives or negatives.
//
// Parameters:
//
// - gender:
//   Specifies the number of knuckle joints based on hinge leaf gender.
//
// - scg_type:
//   Solid Constructive Geometry type.
//   If C_POSITIVE, then add to the base work piece.
//   If C_NAGATIVE, then subtract from the base workpiece.
//
// - fill_component_clearance:
//   If true, then create wide cutting blocks that fill in the component clearance.
//   If false, then create narrow cutting blocks that leave space for the component clearance.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_gusset_array = (params, gender, curve, scg_type, fill_component_clearance) => {
  // Compute cutting block size.

  const cutting_block_size = params.m_leaf_gauge + params.m_knuckle_gusset_width
  const leaf_height = (scg_type === C_NEGATIVE) ? params.m_leaf_height + SCG_OVERLAP : params.m_leaf_height

  // Compute cutting block translation.

  const xt = cutting_block_size / 2.0
  const yt = 0.0
  const zt = 0.0

  // Create gusset array.

  return difference(
    // Create a solid cylindrical gusset cylinder.

    workpiece_gusset(
      params,
      params.m_knuckle_gusset_width,
      leaf_height,
      params.m_leaf_gauge,
      curve,
      scg_type
    ),

    // Use the knuckle array cutter tool, to cut knuckle gaps into the gusset to match the dimensions of the knuckles.

    translate([xt, yt, zt],
      tool_cutter_knuckle_array(
        params,
        gender,
        !fill_component_clearance,
        cutting_block_size
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_gusset
// Module Type: Workpiece
//
// Description:
//
// - Knuckle gusset used to strengthen the knuckle joints.
//
// Parameters:
//
// - width
//   The length of the gusset, as measured from the edge of the knuckle.
//   We name it "width", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - height
//   The thickness of the gusset.
//   We name this "height", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - knuckle_radus
//   Outer radius of the knuckles. This is also the same value as the leaf gauge.
//
// - curve
//   The mathematical function used to describe the shape of the gusset.
//   - Linear
//   - Parabolic
//   - Circular
//
// - scg_type
//   Solid Constructive Geometry (SCG) mode.
//   - If set to 0 or C_NEGATVE, to create the version of the component used for cutting away from the leaves.
//   - If set to 1 or C_POSITIVE, to create the version of the component used for adding to the leaves and knuckles.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_gusset = (params, width, height, knuckle_radus, curve, scg_type) => {
  if (curve === C_FUNCTION_LINEAR) return workpiece_gusset_linear(params, width, height, knuckle_radus, scg_type)
  else if (curve === C_FUNCTION_CIRCULAR) return workpiece_gusset_circular(params, width, height, knuckle_radus, scg_type)
  else if (curve === C_FUNCTION_PARABOLIC) return workpiece_gusset_parabolic(params, width, height, knuckle_radus, scg_type)
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_gusset_linear
// Module Type: Workpiece
//
// Description:
//
// - Linear knuckle gusset, called by workpiece_gusset.
//
// Parameters:
//
// - width
//   The length of the gusset, as measured from the edge of the knuckle.
//   We name it "width", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - height
//   The thickness of the gusset.
//   We name this "height", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - knuckle_radus
//   Outer radius of the knuckles. This is also the same value as the leaf gauge.
//
// - scg_type
//   Solid Constructive Geometry (SCG) mode.
//   - If set to 0 or C_NEGATVE, to create the version of the component used for cutting away from the leaves.
//   - If set to 1 or C_POSITIVE, to create the version of the component used for adding to the leaves and knuckles.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_gusset_linear = (params, width, height, knuckle_radus, scg_type) => {
  // Initialize input values.

  const w = width // Gusset width.
  const h = height // Hinge leaf height.
  const r = knuckle_radus // Knuckle radius is equal to the leaf gauge.
  const s = w + r // Cartesian position of the point where the gusset curve merges with the leaf.
  const g = params.m_leaf_gauge // Leafe gauge.
  const c = SCG_OVERLAP // Amount to overlap unions in order to prevent Boolean anomalies.

  // Compute gusset tangent curve.

  const x = r * r / s
  const y = Math.sqrt(r * r - x * x)

  // Compute work piece translation and dimensions.

  const wp_xd = 0 // Work piece origin x.
  const wp_yd = 0 // Work piece origin y.
  const wp_zd = -g + c // Work piece origin z.

  const wp_w = s // Work piece width (x axis length).
  const wp_g = g + y - c // Work piece gauge (y access length. i.e. thickness).
  const wp_h = h // Work piece height (y axis length).

  // Compute cutting tool translation and dimensions.

  const ct_xd = 0
  const ct_yd = 0
  const ct_zd = 0

  const ct_w0 = x
  const ct_w1 = s
  const ct_g0 = y
  const ct_g1 = 0
  const ct_h = h + 2 * c

  // Compute and configure orientation.

  const test_yd = 0

  const zs = (scg_type === C_POSITIVE) ? 1.0 : -1.0

  return scale([1.0, -1.0, zs],
    difference(
      translate([wp_xd, wp_yd + test_yd, wp_zd],
        rotate([90, 0, 0],
          linear_extrude({ height: wp_h, center: true }, rectangle(wp_w, wp_g, false))
        )
      ),

      translate([ct_xd, ct_yd + test_yd, ct_zd],
        rotate([90, 0, 0],
          linear_extrude({ height: ct_h, center: true }, triangle([[ct_w0, ct_g0], [ct_w1 + c, ct_g0 + c], [ct_w1, ct_g1]]))
        )
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_gusset_circular
// Module Type: Workpiece
//
// Description:
//
// - Linear knuckle gusset, called by workpiece_gusset.
//
// Parameters:
//
// - width
//   The length of the gusset, as measured from the edge of the knuckle.
//   We name it "width", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - height
//   The thickness of the gusset.
//   We name this "height", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - knuckle_radus
//   Outer radius of the knuckles. This is also the same value as the leaf gauge.
//
// - scg_type
//   Solid Constructive Geometry (SCG) mode.
//   - If set to 0 or C_NEGATVE, to create the version of the component used for cutting away from the leaves.
//   - If set to 1 or C_POSITIVE, to create the version of the component used for adding to the leaves and knuckles.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_gusset_circular = (params, width, height, knuckle_radus, scg_type) => {
  // Initialize input values.

  const w = width // Gusset width.
  const g = knuckle_radus // Knuckle radius is equal to the leaf gauge.
  const c = SCG_OVERLAP // Amount to overlap unions in order to prevent Boolean anomalies.

  // Compute gusset radius. The radius of the circle, that is tangential to the knuckle cylinder.

  const r = (2.0 * g * w + w * w) / (2.0 * g)

  // Compute gusset height. The point of intersection between the knuckle cylinder and the gusset cutter.

  const h = (g * r) / Math.sqrt(g * g + 2.0 * g * w + r * r + w * w)

  // Compute intersection point between knuckle and gusset cutting tool, using gusset height.
  // The coordinate of the intersection point are, p(x,h), where h is the vertical value of the coordinate.

  const x = h * (g + w) / r

  // Compute gusset cutting tool translation.

  const ctxd = g + w
  const ctyd = c
  const ctzd = r
  const ctt = height + 2.0 * x

  // Compute gusset work piece translation and dimensions.

  const wpw = g + w - x
  const wph = h + c
  const wpxd = x
  const wpyd = 0.0
  const wpzd = 0.0 - c
  const wpt = height

  // Initialize cutting plane and component scaling.

  const xr = 90.0
  const yr = 0.0
  const zr = 0.0

  const xs = 1.0
  const ys = -1.0
  const zs = (scg_type === C_POSITIVE) ? 1.0 : -1.0

  // Generate gusset.

  return color('silver',
    scale([xs, ys, zs],
      difference(
        translate([wpxd, wpyd, wpzd], rotate([xr, yr, zr], linear_extrude({ height: wpt, center: true }, rectangle(wpw, wph, false)))),
        translate([ctxd, ctyd, ctzd], rotate([xr, yr, zr], linear_extrude({ height: ctt, center: true }, circle(r))))
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      workpiece_gusset_parabolic
// Module Type: Workpiece
//
// Description:
//
// - Parabolic knuckle gusset, called by workpiece_gusset.
//
// Parameters:
//
// - width
//   The length of the gusset, as measured from the edge of the knuckle.
//   We name it "width", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - height
//   The thickness of the gusset.
//   We name this "height", in order to maintain dimension naming consistency with the rest of the hinge dimensions.
//
// - knuckle_radus
//   Outer radius of the knuckles. This is also the same value as the leaf gauge.
//
// - scg_type
//   Solid Constructive Geometry (SCG) mode.
//   - If set to 0 or C_NEGATVE, to create the version of the component used for cutting away from the leaves.
//   - If set to 1 or C_POSITIVE, to create the version of the component used for adding to the leaves and knuckles.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const workpiece_gusset_parabolic = (params, width, height, knuckle_radus, scg_type) => {
  const RESOLUTION = params.m_resolution / C_MIN_TESSELLATION

  // Initialize input values.

  const w = width // Gusset width.
  const h = height // Hinge leaf height.
  const r = knuckle_radus // Knuckle radius is equal to the leaf gauge.
  const s = w + r // Cartesian position of the point where the gusset curve merges with the leaf.
  const g = params.m_leaf_gauge // Leafe gauge.
  const c = SCG_OVERLAP // Amount to overlap unions in order to prevent Boolean anomalies.

  // Compute parabolic point of contact with the knuckle cylinder.

  const i = Math.sqrt(8.0 * r * r + s * s) // Common root.
  const x = (i - s) / 2.0 // x intercept.
  const y = Math.sqrt(r * r - x * x) // y intercept.

  // Compute coefficient 'a' of vertex form parabola.
  // y = a2(x-s)2

  const an = root4(2.0) * root4(s * (i - s) - 2.0 * r * r) // Numerator.
  const ad = Math.sqrt(s * (5.0 * s - 3.0 * i) + 4.0 * r * r) // Denominator.
  const a = an / ad // Coefficient 'a' of, y = a2(x-s)2

  // Compute work piece translation and dimensions.

  const wp_xd = 0 // Work piece origin x.
  const wp_yd = 0 // Work piece origin y.
  const wp_zd = -g + c // Work piece origin z.

  const wp_w = s // Work piece width (x axis length).
  const wp_g = g + y - c // Work piece gauge (y access length. i.e. thickness).
  const wp_h = h // Work piece height (y axis length).

  // Compute cutting tool translation and dimensions.

  const ct_xd = 0
  const ct_yd = 0
  const ct_zd = 0

  const ct_h = h + 2 * c

  // Compute positive or negative tool orientation. We flip the tool by using a negative unit scale.

  const test_yd = 0
  const zs = (scg_type === C_POSITIVE) ? 1.0 : -1.0

  // Create gusset work piece.

  return scale([1.0, -1.0, zs],
    difference(
      // Work piece.

      translate([wp_xd, wp_yd + test_yd, wp_zd], rotate([90, 0, 0],
        linear_extrude({ height: wp_h, center: true }, rectangle(wp_w, wp_g, false))
      )),

      // Parabolic cutting tool.

      translate([ct_xd, ct_yd + test_yd, ct_zd], rotate([90, 0, 0],
        linear_extrude({ height: ct_h, center: true }, parabolic_conic_section(a, s, 0, s, RESOLUTION))
      ))
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      tool_cutter_fastener
// Module Type: Cutting Tool.
//
// Description:
//
// - Cutting tool used to cut fastener holes into leaf workpiece.
//
// Parameters:
//
// - z_offset:
//   Depth of the cut.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const tool_cutter_fastener = (params, z_offset) => {
  // Initialize local variables.

  const id = params.m_fastener_thread_diameter // Inner diameter.
  const od = params.m_fastener_head_diameter // Outer diameter.
  const t = params.m_fastener_head_type // 0 = Fillister (Pan head), 1 = flat countersunk.
  const z0 = z_offset - params.m_leaf_gauge // Vertical position of head.
  const z1 = z_offset - params.m_counter_sink_depth // Vertical position of thread.
  const h0 = params.m_leaf_gauge // Height of head.
  const h1 = params.m_counter_sink_depth // Height of thread.
  const c = SCG_OVERLAP

  // Create cutting tool.
  let d_top
  let d_bottom
  let h
  if (t === 0) {
    // Fillister (Pan head).
    d_top = od
    d_bottom = od
    h = h1 + c
  } else {
    // Flat countersunk.
    d_top = od + c
    d_bottom = id
    h = h1 + c
  }

  return union(
    // Thread

    translate([0, 0, z0 - c],
      cylinder({ d: id, h: h0 + 2.0 * c, center: false })
    ),

    // Head.

    union(
      // Fastener head.

      translate([0, 0, z1],
        cylinder({ d2: d_top, d1: d_bottom, h: h, center: false })
      ),

      // Cutting tool extention.

      translate([0, 0, c],
        cylinder({ d: od, h: params.m_leaf_gauge, center: false })
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      tool_cutter_fastener_set
// Module Type: Cutting Tool.
//
// Description:
//
// - Cutting tool used to cut fastener holes into leaf workpiece.
//
// Parameters:
//
// - fastener_count:
//   Number of fastener holes to be cut into a single leaf.
//   The total number of fastener holes on the whole hinge, will be twice the value of fastener_count.
//   i.e. 'fastener_count' holes, on each leaf.
//
// - fastener_column_count:
//   Number of fastener column per leaf. This value can be either 1, or 2.
//
// - z_offset:
//   Depth of the cut.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const tool_cutter_fastener_set = (params) => {
  const fastener_count = params.m_fastener_count
  const fastener_column_count = params.m_fastener_column_count
  const z_offset = 0

  // Relative origin.

  const xo = params.m_leaf_gauge + params.m_component_clearance / 2 + params.m_fastener_head_diameter / 2 + params.m_fastener_margin
  const yo = -params.m_leaf_height / 2 + params.m_fastener_head_diameter / 2 + params.m_fastener_margin

  // Column offsets.

  const col0 = 0
  const col1 = params.m_leaf_width - params.m_fastener_head_diameter / 2 - params.m_fastener_margin - xo

  // Loop configuration.

  const even = !((fastener_count % 2))
  const n1 = fastener_count - 1
  const n2 = Math.round(fastener_count / 2) - 1
  const k1 = (params.m_leaf_height - params.m_fastener_head_diameter - 2 * params.m_fastener_margin) / n1
  const k2 = (params.m_leaf_height - params.m_fastener_head_diameter - 2 * params.m_fastener_margin) / n2

  // Generate fastener cutting tool.

  const fastener_set = []

  // One column of fastener holes, if we have selected one fastener hole column.

  if (fastener_column_count === 1) {
    for (let row = 0; row <= n1; row++) {
      const cx = (col0 + col1) / 2.0
      const tx = xo + cx
      const ty = yo + row * k1
      const tz = 0

      fastener_set.push(translate([tx, ty, tz], tool_cutter_fastener(params, z_offset)))
    }
  }

  // Two columns of fastener holes, if we have selected two fastener hole column.

  if (fastener_column_count === 2) {
    for (let col = 0; col <= 1; col++) {
      // Column 0, offset translation when we have an odd number of fasteners.

      if (col === 0) {
        const m = (even) ? 0 : 1

        for (let row = 0; row <= n2 - m; row++) {
          const cx = (col === 0) ? col0 : col1
          const tx = xo + cx
          const ty = (even) ? yo + row * k2 : yo + row * k2 + k2 / 2
          const tz = 0

          fastener_set.push(translate([tx, ty, tz], tool_cutter_fastener(params, z_offset)))
        }
      }

      // Column 1.

      if (col === 1) {
        for (let row = 0; row <= n2; row++) {
          const cx = (col === 0) ? col0 : col1
          const tx = xo + cx
          const ty = yo + row * k2
          const tz = 0

          fastener_set.push(translate([tx, ty, tz], tool_cutter_fastener(params, z_offset)))
        }
      }
    }
  }
  return fastener_set
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      tool_cutter_text.
// Module Type: Tool cutter.
//
// Description:
//
// - Inscribes a string of text onto a surface.
//
// Parameters:
//
// - string:
//   The string of text we would like to inscribes.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const tool_cutter_text = (string, size) => {
  // create text cutter.

  const font = 'Ariel:style=Bold'
  const height = 0.15 * 6.0
  const xd = 20.0
  const yd = 0.0
  const zd = height

  return translate([xd, yd, -zd],
    rotate([0.0, 0.0, -90.0],
      linear_extrude({ height: height + SCG_OVERLAP, center: true },
        text(string, font, size, 'center', 'center')
      )
    )
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      tool_cutter_knuckle_array
// Module Type: Cutting tool.
//
// Description:
//
// - Create an array of cutting blocks. Mostly used to cut gusset workpiece into individual gusset positives or negatives.
//
// Parameters:
//
// - gender:
//   Specifies the number of knuckle joints based on hinge leaf gender.
//
// - fill_component_clearance:
//   If true, then create wide cutting blocks that fill in the component clearance.
//   If false, then create narrow cutting blocks that leave space for the component clearance.
//
// - size:
//   Specifies the dimension used for the x and z axes.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const tool_cutter_knuckle_array = (params, gender, fill_component_clearance, size) => {
  // Initialize local variables.

  const n = params.m_knuckle_count
  const h = params.m_leaf_height
  const c = params.m_component_clearance

  // Compute knuckle width and segment width.

  const k = (h + c) / n - c
  const s = (fill_component_clearance) ? k + 2.0 * c : k

  // Compute segment offset.

  const o = (fill_component_clearance) ? c : 0.0

  // Generate block array.

  const a = 0
  const b = (gender === C_MALE) ? n / 2 : n / 2 - 1
  const g = (gender === C_MALE) ? 0.0 : k + c

  const knuckle_array = []
  for (let i = a; i <= b; i++) {
    // Compute translation index.

    const ki = g + 2.0 * i * (k + c) - h / 2.0 - o

    // Initialize translation.

    const xt = -size / 2.0
    const yt = ki
    const zt = -size / 2.0

    // Initialize cutting block dimensions.

    const cube_x = size
    const cube_y = s
    const cube_z = 2.0 * size

    // Create cutting block.

    knuckle_array.push(color('red',
      translate([xt, yt, zt],
        cube({ size: [cube_x, cube_y, cube_z] })
      )
    ))
  }
  return knuckle_array
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      tool_cutter_pin_shaft_counterbore
// Module Type: Cutting tool.
//
// Description:
//
// - Cuts a counterbore into the endcaps of the pin shaft.
// - If the model is being printed in its default orientation, open and flat on the build plate, then support material may be required
//   for the counterbore.
//
// Parameters:
//
// - diameter:
//   Specifies the diameter of the counterbore.
//   For square and hexagonal counterbore shapes, the diameter refers to the inscribed circle of those shapes.
//
// - depth:
//   Specifies the depth of the cut.
//
// - shape:
//   The shame of the counterbore.
//   - Circular
//   - Square
//   - Hexagonal
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const tool_cutter_pin_shaft_counterbore = (params, diameter_top, depth_top, shape_top, diameter_bottom, depth_bottom, shape_bottom) => {
  // Local constants.

  const TOP_COUNTER_BORE_ENABLED = true
  const BOTTOM_COUNTER_BORE_ENABLED = true

  // Initialize local variables.

  const d0 = diameter_bottom
  const d1 = diameter_top
  const h0 = depth_bottom + SCG_OVERLAP
  const h1 = depth_top + SCG_OVERLAP

  // Compute diameter of polygon, inscribed by a circle of radius d/2.

  const s = 6 // Polygon sides.
  const a = 360.0 / (2.0 * s) // Half the angle between each point of the polygon.

  const x0 = d0 / 2.0 // Bottom: Run of the right angle triangle who hypotenuse is equal to half the radius of our new circle.
  const y0 = x0 * tan(a) // Bottom: Rise of the right angle triangle who hypotenuse is equal to half the radius of our new circle.
  const r0 = Math.sqrt(x0 * x0 + y0 * y0) // Bottom: Hypotenuse of the right angle triangle who hypotenuse is equal to half the radius of our new circle.

  const x1 = d1 / 2.0 // Top: Run of the right angle triangle who hypotenuse is equal to half the radius of our new circle.
  const y1 = x1 * tan(a) // Top: Rise of the right angle triangle who hypotenuse is equal to half the radius of our new circle.
  const r1 = Math.sqrt(x1 * x1 + y1 * y1) // Top: Hypotenuse of the right angle triangle who hypotenuse is equal to half the radius of our new circle.

  // Compute cutting tool translation.

  const xd = 0.0
  const yd0 = (h0 - params.m_leaf_height) / 2.0 - SCG_OVERLAP
  const yd1 = -(h1 - params.m_leaf_height) / 2.0 + SCG_OVERLAP
  const zd = 0.0

  // Compute polygon rotation angle.

  const rx = 90.0
  const ry = (s % 2 === 0) ? a + 90 : -a / 2.0
  const rz = 0.0

  // Create top counterbore cutting tool.

  const counter_bores = []
  if (BOTTOM_COUNTER_BORE_ENABLED) {
    if (shape_bottom === C_CIRCULAR) {
      counter_bores.push(translate([xd, yd0, zd], rotate([rx, ry, rz], cylinder({ h: h0, r: d0 / 2.0, center: true }))))
    } else if (shape_bottom === C_SQUARE) {
      counter_bores.push(translate([xd, yd0, zd], cube({ size: [diameter_bottom, h0, diameter_bottom], center: true })))
    } else if (shape_bottom === C_HEXAGONAL) {
      counter_bores.push(translate([xd, yd0, zd], rotate([rx, ry + 90, rz], cylinder({ h: h0, r: r0, center: true, fn: s }))))
    }
  }

  // Create bottom counterbore cutting tool.

  if (TOP_COUNTER_BORE_ENABLED) {
    if (shape_top === C_CIRCULAR) {
      counter_bores.push(translate([xd, yd1, zd], rotate([rx, ry, rz], cylinder({ h: h1, r: d1 / 2.0, center: true }))))
    } else if (shape_top === C_SQUARE) {
      counter_bores.push(translate([xd, yd1, zd], cube({ size: [diameter_top, h1, diameter_top], center: true })))
    } else if (shape_top === C_HEXAGONAL) {
      counter_bores.push(translate([xd, yd1, zd], rotate([rx, ry, rz], cylinder({ h: h1, r: r1, center: true, fn: s }))))
    }
  }
  return counter_bores
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      parabolic_conic_section.
// Module Type: 2D Shape.
//
// Description:
//
// - Creates a parabolic conic section object.
//
// Parameters:
//
// - radius:
//   Radius of the cylinder sector.
//
// - a:
//   Coefficient of the vertex form parabola, y = a2(x-b)2.
//
// - x:
//   x Coordinate of parabola turning point.
//   Note:
//   For the sake of simplifying the actual parabolic function used in the recursive
//   function "parabolic_vector", we use a call to "translate" to set the vertex, rather than the parabolic function its self.
//
// - y:
//   y Coordinate of parabola turning point.
//   Note:
//   For the sake of simplifying the actual parabolic function used in the recursive
//   function "parabolic_vector", we use a call to "translate" to set the vertex, rather than the parabolic function its self.
//
// - domain:
//   The input domain x, over which to compute the parabolic function.
//
// - resolution:
//   The input domain step size, is used to control the resolution of the shape.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const parabolic_conic_section = (a, x, y, domain, resolution) => {
  // Generate 2D geometry

  const t = 0.0
  const n = resolution
  const i = 0
  const d = domain
  const v = []

  const points = parabolic_vector(a, t, n, i, d, v)

  // Generate 3D object.

  return translate([x, y, 0],
    polygon(points)
  )
}

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Module:      triangle.
// Module Type: 2D Shape.
//
// Description:
//
// - Creates a 2D triangle from an array of three vertices.
//
// Parameters:
//
// - x0, x1, x2
//   x coordinates of vertices 0 through 2.
//
// - y0, y1, y2
//   y coordinates of vertices 0 through 2.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const triangle = (points) => polygon(points.reverse())

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Function: root4
//
// Description:
//
// - Compute the 4th root of x.
//
// Return Value:
//
// - Return the 4th root of x.
//
// Parameters:
//
// - x
//   Input value.
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const root4 = (x) => (x >= 0) ? Math.sqrt(Math.sqrt(x)) : 0

// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------
// Function: Generate a parabolic vector point array.
//
// Description:
//
// - Recursive function to generate an array of 2D points on a parabolic curve.
//
// - The parabolic vertex form is used.
//
//     y = a2(x-b)2
//
//   Where,
//
//     a is the horizontal scale of the parabola.
//     (b,c) is the Cartesian position of the turning point.
//
//
// Parameters:
//
// - a
//   Horizontal scale of the parabola.
//
// - x
//   Horizontal input domain.
//
// - n
//   Tessellation factor. Number of points to compute for each half of the parabola object, with both halves sharing the turning point.
//   For example:
//   - A tessellation factor of 1, will compute 3 points in total. Two for each half, with one out of the two on each half being the
//     Shared turning point.
//   - A tessellation factor of 2, with compute 5 points in total, 3 for each half with a shared turning point.
//
// - i
//   Point index. Initialize to zero.
//
// - d
//   Input domain. The x range over which to compute the function.
//   -d <= x <= d
//
// - v
//   Vector that will be populated with geometry points. Initialize to empty vector, [].
//
// -------------------------------------+---------------------------------------+---------------------------------------+---------------------------------------

const parabolic_vector = (a, x, n, i, d, v) =>
  (
    i > 2.0 * d * n

    // Recursive terminating condition:
    //   Return an empty vector.

      ? v

    // Recursive general condition:
    //   Compute the next point on the parabolic path.
    //   x = i/n - 1
    //   y = a2(i/n - 1)2

      : parabolic_vector(a, x, n, i + 1, d, v.concat([[i / n - d, a * a * (i / n - d) * (i / n - d)]]))
  )

/***************************************************
 * shims from OPENSCAD to JSCAD
 ***************************************************/

const { booleans, colors, extrusions, primitives, transforms, utils } = require('@jscad/modeling')

const tan = (angle) => Math.tan(utils.degToRad(angle))

const rotate = (angles, ...objects) => {
  angles = angles.map((angle) => utils.degToRad(angle))
  return transforms.rotate(angles, objects)
}

// NOTE: this design uses scale() only for mirror()
const scale = (factors, ...objects) => {
  if (factors[0] < 0) objects = transforms.mirrorX(objects)
  if (factors[1] < 0) objects = transforms.mirrorY(objects)
  if (factors[2] < 0) objects = transforms.mirrorZ(objects)
  return objects
}

const translate = (offset, ...objects) => transforms.translate(offset, objects)

const union = (...objects) => booleans.union(objects)

const difference = (...objects) => booleans.subtract(objects)

const circle = (radius) => primitives.circle({ radius })

const cylinder = (options) => {
  let d1 = options.d1 ? options.d1 : options.d ? options.d : 0
  let d2 = options.d2 ? options.d2 : options.d ? options.d : 0
  if (d1 === 0) d1 = options.r ? options.r * 2 : 2
  if (d2 === 0) d2 = options.r ? options.r * 2 : 2

  const height = options.h ? options.h : 1
  const segments = options.fn ? options.fn : 32
  const center = options.center ? [0, 0, 0] : [0, 0, height / 2]
  options = {
    height,
    startRadius: [d1 / 2, d1 / 2],
    endRadius: [d2 / 2, d2 / 2],
    center,
    segments
  }
  return primitives.cylinderElliptic(options)
}

const cube = (options) => {
  const size = options.size ? options.size : [1, 1, 1]
  const center = options.center ? [0, 0, 0] : [size[0] / 2, size[1] / 2, size[2] / 2]
  options = {
    size,
    center
  }
  return primitives.cuboid(options)
}

const polygon = (points) => primitives.polygon({ points })

const rectangle = (x, y, center) => {
  const options = {
    center: center ? [0, 0] : [x / 2, y / 2],
    size: [x, y]
  }
  return primitives.rectangle(options)
}

const color = (name, ...objects) => {
  const rgb = colors.colorNameToRgb(name)
  return colors.colorize(rgb, objects)
}

const linear_extrude = (options, ...objects) => {
  const center = options.center ? options.center : false
  const height = options.height ? options.height : 1
  options = {
    height
  }
  objects = extrusions.extrudeLinear(options, objects)
  if (center) objects = transforms.center({ axes: [false, false, true] }, objects)
  return objects
}

module.exports = { main, getParameterDefinitions }
