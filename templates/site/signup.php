<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title><?php echo Yii::t('SignUpForm', 'Signup') . ' - ' . Yii::t('Toast', 'Toast'); ?></title>
        <link rel="shortcut icon" href="<?php echo Yii::app()->request->baseUrl; ?>/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->baseUrl; ?>/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->baseUrl; ?>/assets/css/bootstrap-responsive.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->theme->baseUrl; ?>/assets/css/signup.css" />
        <script type="text/javascript" src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/js/jquery.js"></script>
        <script type="text/javascript" src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/js/parsley.js"></script>
    </head>
    <body>
        <div class="signup-form container-fluid form-horizontal">
            <div class="row-fluid">
                <img src="<?php echo Yii::app()->theme->baseUrl; ?>/assets/images/logo_signup.png" alt="Toast"/>
                <span class="signup-label pull-right">
                    <?php
                    echo Yii::t('SignUpForm', 'Signup');
                    ?>
                </span>
                <hr />
            </div>
            <div class="well well-smallest">
                <strong>
                <?php
                echo Yii::t('SignUpForm', 'Account');
                ?>
                </strong>
            </div>
            <?php echo CHtml::beginForm('', 'post', array('data-validate' => 'parsley', 'data-trigger' => 'change focusin focusout keyup')); ?>
            <div class="control-group <?php if($signupForm->getError('username')) echo 'error'; ?>">
                <?php
                echo CHtml::activeLabelEx($signupForm, 'username');
                ?>
                <div class="controls">
                    <?php
                    echo CHtml::activeTextField($signupForm, 'username', array(
                        'class' => 'input-xlarge',
                        'data-required' => 'ture',
                        'data-regexp' => '^[a-zA-z][a-zA-Z_0-9.]*',
                        'data-rangelength' => '[5, 20]',
                        'data-regexp-message' => Yii::t('SignUpForm', 'Username is not valid')
                    ));
                    echo CHtml::tag('span', array('class' => 'help-inline'), $signupForm->getError('username'));
                    ?>
                </div>
            </div>
            <div class="control-group <?php if($signupForm->getError('realname')) echo 'error'; ?>">
                <?php
                echo CHtml::activeLabelEx($signupForm, 'realname');
                ?>
                <div class="controls">
                    <?php
                    echo CHtml::activeTextField($signupForm, 'realname', array(
                        'class' => 'input-xlarge',
                        'data-required' => 'ture',
                        'data-rangelength' => '[2, 20]',
                    ));
                    echo CHtml::tag('span', array('class' => 'help-inline'), $signupForm->getError('realname'));
                    ?>
                </div>
            </div>
            <div class="control-group <?php if($signupForm->getError('password')) echo 'error'; ?>">
                <?php
                echo CHtml::activeLabelEx($signupForm, 'password');
                ?>
                <div class="controls">
                    <?php
                    echo CHtml::activePasswordField($signupForm, 'password', array(
                        'class' => 'input-xlarge',
                        'data-required' => 'ture',
                        'data-minlength' => '8',
                    ));
                    echo CHtml::tag('span', array('class' => 'help-inline'), $signupForm->getError('password'));
                    ?>
                </div>
            </div>
            <div class="control-group <?php if($signupForm->getError('password2')) echo 'error'; ?>">
                <?php
                echo CHtml::activeLabelEx($signupForm, 'password2');
                ?>
                <div class="controls">
                    <?php
                    echo CHtml::activePasswordField($signupForm, 'password2', array(
                        'class' => 'input-xlarge',
                        'data-required' => 'ture',
                        'data-equalto' => '#SignUpForm_password',
                        'data-equalto-message' => Yii::t('SignUpForm', 'Password2 is not equal password.'),
                    ));
                    echo CHtml::tag('span', array('class' => 'help-inline'), $signupForm->getError('password2'));
                    ?>
                </div>
            </div>
            <div class="control-group <?php if($signupForm->getError('email')) echo 'error'; ?>">
                <?php
                echo CHtml::activeLabelEx($signupForm, 'email');
                ?>
                <div class="controls">
                    <?php
                    echo CHtml::activeTextField($signupForm, 'email', array(
                        'class' => 'input-xlarge',
                        'data-required' => 'ture',
                        'data-type' => 'email'
                    ));
                    echo CHtml::tag('span', array('class' => 'help-inline'), $signupForm->getError('email'));
                    ?>
                </div>
            </div>
            <div class="well well-smallest">
                <strong>
                <?php
                echo Yii::t('SignUpForm', 'Product list');
                ?>
                </strong>
            </div>
            <div class="row-fluid row-product-list">
                <?php
                echo CHtml::activeCheckBoxList($signupForm, 'products', $productOpts, array(
                    'separator' => '',
                    'template' => '<div class="checkbox inline span4">{input}{label}</div>',
                ));
                ?>
            </div>
            <div class="row-fluid">
               <?php
                echo CHtml::submitButton(Yii::t('SignUpForm', 'Signup'),  array('class' => 'btn btn-primary'));
                ?>
            </div>
            <?php echo CHtml::endForm(); ?>
        </div>
    </body>
</html>